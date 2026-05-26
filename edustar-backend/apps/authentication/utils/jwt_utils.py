from rest_framework_simplejwt.tokens import RefreshToken


def generate_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    refresh['username'] = user.username
    refresh['email'] = user.email
    refresh['full_name'] = user.get_full_name()
    refresh['role'] = user.role

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
