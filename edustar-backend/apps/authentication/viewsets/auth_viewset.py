from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from ..serializers import LoginSerializer, RegisterSerializer, TokenRefreshSerializer, UserMeSerializer
from ..utils.jwt_utils import generate_tokens_for_user
from apps.core.models import AuditLog

User = get_user_model()


class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def get_permissions(self):
        if self.action in ['me', 'logout']:
            return [IsAuthenticated()]
        return [AllowAny()]

    @action(detail=False, methods=['POST'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        login_input = serializer.validated_data['username']
        password = serializer.validated_data['password']
        otp_code = serializer.validated_data.get('otp_code', '')

        try:
            if '@' in login_input:
                user = User.objects.get(email=login_input)
            else:
                user = User.objects.get(username=login_input)
        except User.DoesNotExist:
            return Response({'error': 'Identifiants invalides.'}, status=status.HTTP_401_UNAUTHORIZED)

        if user.is_locked:
            return Response(
                {'error': 'Compte temporairement verrouillé.', 'locked_until': user.locked_until.isoformat()},
                status=status.HTTP_403_FORBIDDEN
            )

        if not user.check_password(password):
            user.record_failed_login()
            return Response({'error': 'Identifiants invalides.'}, status=status.HTTP_401_UNAUTHORIZED)

        if user.otp_enabled and user.otp_verified:
            if not otp_code:
                return Response({'otp_required': True, 'message': 'Code OTP requis.'}, status=status.HTTP_202_ACCEPTED)
            from ..utils.otp_utils import verify_otp
            if not verify_otp(user.otp_secret, otp_code):
                return Response({'error': 'Code OTP invalide.'}, status=status.HTTP_401_UNAUTHORIZED)

        user.record_successful_login(request.META.get('REMOTE_ADDR'))
        tokens = generate_tokens_for_user(user)

        AuditLog.log_action(
            user=user, action='LOGIN', instance=user,
            details=f"Connexion depuis {request.META.get('REMOTE_ADDR')}",
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )

        return Response({
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'user': UserMeSerializer(user).data,
        })

    @action(detail=False, methods=['POST'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = generate_tokens_for_user(user)

        AuditLog.log_action(user=user, action='CREATE', instance=user, details='Création de compte')

        return Response({
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'user': UserMeSerializer(user).data,
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['POST'])
    def refresh(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            refresh = RefreshToken(serializer.validated_data['refresh'])
            user = User.objects.get(id=refresh['user_id'])
            if not user.is_active:
                return Response({'error': 'Compte désactivé.'}, status=status.HTTP_403_FORBIDDEN)
            return Response({'access': str(refresh.access_token)})
        except Exception:
            return Response({'error': 'Token de rafraîchissement invalide.'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['GET', 'PATCH'])
    def me(self, request):
        if request.method == 'GET':
            return Response(UserMeSerializer(request.user).data)

        user = request.user
        updatable = ['first_name', 'last_name', 'email', 'phone', 'preferred_language']
        changed = [f for f in updatable if f in request.data]
        for field in changed:
            setattr(user, field, request.data[field])
        if changed:
            user.save(update_fields=changed + ['updated_at'])

        return Response(UserMeSerializer(user).data)

    @action(detail=False, methods=['POST'])
    def logout(self, request):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass

        AuditLog.log_action(user=request.user, action='LOGOUT', instance=request.user, details='Déconnexion')
        return Response({'status': 'Déconnexion réussie.'})
