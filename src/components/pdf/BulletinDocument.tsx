"use client";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Bulletin, Student } from "@/types";

const C = {
  navy: "#1a3c8f",
  navyDark: "#122d6e",
  cyan: "#0099cc",
  cyanLight: "#e0f4fb",
  ivory: "#f5f7fa",
  white: "#ffffff",
  ink: "#0d1b2a",
  ink3: "#4a6080",
  ink4: "#8fa3b8",
  line: "#e2e8f0",
  lineDark: "#c9d4e0",
  success: "#0a7c4e",
  successLight: "#e6f5ee",
  warning: "#b45309",
  warningLight: "#fef3cd",
  danger: "#c0392b",
  dangerLight: "#fdecea",
};

function getMention(moy: number) {
  if (moy >= 16) return { label: "Très bien", color: C.success, bg: C.successLight };
  if (moy >= 14) return { label: "Bien", color: C.cyan, bg: C.cyanLight };
  if (moy >= 12) return { label: "Assez bien", color: C.navy, bg: "#e8eef9" };
  if (moy >= 10) return { label: "Passable", color: C.warning, bg: C.warningLight };
  return { label: "Insuffisant", color: C.danger, bg: C.dangerLight };
}

function getStatutColor(statut: string) {
  if (statut === "Validé") return { color: C.success, bg: C.successLight };
  if (statut === "Rattrapage") return { color: C.warning, bg: C.warningLight };
  return { color: C.danger, bg: C.dangerLight };
}

function getInitials(nom: string, prenom: string) {
  return `${prenom[0] ?? ""}${nom[0] ?? ""}`.toUpperCase();
}

const s = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.ink,
  },
  // Header
  header: {
    backgroundColor: C.navyDark,
    paddingTop: 16,
    paddingBottom: 14,
    paddingLeft: 22,
    paddingRight: 22,
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: C.cyan,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  logoText: {
    color: C.white,
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
  },
  headerCenter: { flex: 1 },
  schoolName: {
    color: C.white,
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  schoolSub: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 7.5,
  },
  headerRight: { alignItems: "flex-end" },
  bulletinTag: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 6.5,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
  },
  bulletinId: {
    color: C.white,
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
  },
  // Cyan accent bar
  accentBar: { height: 5, backgroundColor: C.cyan },
  // Body
  body: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 22,
    paddingRight: 22,
  },
  // Section heading
  sectionHead: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: C.ink4,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    borderBottomStyle: "solid",
  },
  // Student card
  studentCard: {
    backgroundColor: C.ivory,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.line,
    borderStyle: "solid",
    padding: 12,
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "center",
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.navy,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    color: C.white,
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
  },
  studentGrid: { flex: 1, flexDirection: "row" },
  studentCol: { flex: 1 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 7,
    color: C.ink4,
    width: 52,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
    flex: 1,
  },
  // Stats band
  statsBand: {
    flexDirection: "row",
    marginBottom: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.line,
    borderStyle: "solid",
    overflow: "hidden",
  },
  statBox: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: C.line,
    borderRightStyle: "solid",
  },
  statBoxLast: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  statSub: {
    fontSize: 6,
    color: C.ink4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Table
  table: { marginBottom: 14 },
  tableHead: {
    backgroundColor: C.navy,
    flexDirection: "row",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4,
  },
  tableHeadText: {
    color: C.white,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    borderBottomStyle: "solid",
    alignItems: "center",
  },
  tableRowAlt: {
    flexDirection: "row",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    borderBottomStyle: "solid",
    backgroundColor: C.ivory,
    alignItems: "center",
  },
  colMat: { flex: 3 },
  colNum: { flex: 1, alignItems: "center" },
  colStat: { flex: 1.5, alignItems: "center" },
  cellText: { fontSize: 8 },
  cellNum: { fontSize: 8, fontFamily: "Helvetica-Bold" },
  cellMoy: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  statPill: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 3,
  },
  statPillText: { fontSize: 6.5, fontFamily: "Helvetica-Bold" },
  // Appreciation
  appreciationWrap: {
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: C.cyan,
    borderLeftStyle: "solid",
    backgroundColor: C.cyanLight,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 2,
  },
  appreciationLabel: {
    fontSize: 6.5,
    color: C.cyan,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  appreciationText: {
    fontSize: 8.5,
    color: C.ink,
    fontFamily: "Helvetica-Oblique",
    lineHeight: 1.45,
  },
  // Signatures
  sigRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  sigBox: {
    flex: 1,
    alignItems: "center",
    marginRight: 8,
  },
  sigBoxLast: {
    flex: 1,
    alignItems: "center",
  },
  sigLabel: {
    fontSize: 7,
    color: C.ink3,
    marginBottom: 28,
  },
  sigLine: {
    width: "80%",
    borderBottomWidth: 1,
    borderBottomColor: C.lineDark,
    borderBottomStyle: "solid",
    marginBottom: 4,
  },
  sigName: {
    fontSize: 6.5,
    color: C.ink4,
  },
  // Footer
  footer: {
    backgroundColor: C.ivory,
    borderTopWidth: 1,
    borderTopColor: C.line,
    borderTopStyle: "solid",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 22,
    paddingRight: 22,
    flexDirection: "row",
    alignItems: "center",
  },
  footerMain: { flex: 1 },
  footerSchool: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.navy,
    marginBottom: 2,
  },
  footerSub: {
    fontSize: 6.5,
    color: C.ink4,
  },
  footerRight: { alignItems: "flex-end" },
  footerDate: { fontSize: 6.5, color: C.ink4 },
  footerConf: { fontSize: 5.5, color: C.ink4, marginTop: 2 },
  // QR placeholder
  qrBox: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: C.lineDark,
    borderStyle: "solid",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    backgroundColor: C.white,
  },
  qrText: { fontSize: 5, color: C.ink4, textAlign: "center" },
});

interface Props {
  bulletin: Bulletin;
  student: Student;
  schoolName?: string;
}

export function BulletinDocument({
  bulletin,
  student,
  schoolName = "EduStar University",
}: Props) {
  const mention = getMention(bulletin.moyGeneral);
  const initials = getInitials(student.nom, student.prenom);
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <Document
      title={`Bulletin — ${student.prenom} ${student.nom} — ${bulletin.semestre}`}
      author={schoolName}
      creator="EduStar ERP"
    >
      <Page size="A4" style={s.page}>
        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.logoBox}>
            <Text style={s.logoText}>E</Text>
          </View>
          <View style={s.headerCenter}>
            <Text style={s.schoolName}>{schoolName}</Text>
            <Text style={s.schoolSub}>
              Système de gestion académique · Yaoundé, Cameroun
            </Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.bulletinTag}>Bulletin de notes</Text>
            <Text style={s.bulletinId}>{bulletin.id}</Text>
          </View>
        </View>

        {/* ── Cyan bar ── */}
        <View style={s.accentBar} />

        <View style={s.body}>
          {/* ── Student info ── */}
          <Text style={s.sectionHead}>Informations étudiant</Text>
          <View style={s.studentCard}>
            <View style={s.avatarCircle}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
            <View style={s.studentGrid}>
              <View style={s.studentCol}>
                <View style={s.infoRow}>
                  <Text style={s.infoLabel}>Nom</Text>
                  <Text style={s.infoValue}>
                    {student.nom} {student.prenom}
                  </Text>
                </View>
                <View style={s.infoRow}>
                  <Text style={s.infoLabel}>Matricule</Text>
                  <Text style={s.infoValue}>{student.code}</Text>
                </View>
                <View style={s.infoRow}>
                  <Text style={s.infoLabel}>Classe</Text>
                  <Text style={s.infoValue}>{student.classe}</Text>
                </View>
              </View>
              <View style={s.studentCol}>
                <View style={s.infoRow}>
                  <Text style={s.infoLabel}>Filière</Text>
                  <Text style={s.infoValue}>{student.filiere}</Text>
                </View>
                <View style={s.infoRow}>
                  <Text style={s.infoLabel}>Session</Text>
                  <Text style={s.infoValue}>{bulletin.session}</Text>
                </View>
                <View style={s.infoRow}>
                  <Text style={s.infoLabel}>Semestre</Text>
                  <Text style={s.infoValue}>{bulletin.semestre}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ── Stats band ── */}
          <View style={s.statsBand}>
            <View style={s.statBox}>
              <Text style={[s.statValue, { color: mention.color }]}>
                {bulletin.moyGeneral.toFixed(2)}
              </Text>
              <Text style={s.statSub}>Moyenne / 20</Text>
            </View>
            <View style={s.statBox}>
              <Text style={[s.statValue, { color: C.navy }]}>
                {bulletin.rang}e
              </Text>
              <Text style={s.statSub}>Rang / {bulletin.effectifClasse}</Text>
            </View>
            <View style={s.statBox}>
              <Text style={[s.statValue, { color: C.success }]}>
                {bulletin.creditsValides}/{bulletin.totalCredits}
              </Text>
              <Text style={s.statSub}>Crédits validés</Text>
            </View>
            <View style={s.statBoxLast}>
              <Text style={[s.statValue, { color: mention.color }]}>
                {mention.label}
              </Text>
              <Text style={s.statSub}>Mention</Text>
            </View>
          </View>

          {/* ── Grade table ── */}
          <Text style={s.sectionHead}>Résultats par matière</Text>
          <View style={s.table}>
            {/* Table header */}
            <View style={s.tableHead}>
              <View style={s.colMat}>
                <Text style={s.tableHeadText}>Matière</Text>
              </View>
              <View style={s.colNum}>
                <Text style={s.tableHeadText}>DS</Text>
              </View>
              <View style={s.colNum}>
                <Text style={s.tableHeadText}>TP</Text>
              </View>
              <View style={s.colNum}>
                <Text style={s.tableHeadText}>Exam</Text>
              </View>
              <View style={s.colNum}>
                <Text style={s.tableHeadText}>Moy</Text>
              </View>
              <View style={s.colNum}>
                <Text style={s.tableHeadText}>Coeff</Text>
              </View>
              <View style={s.colNum}>
                <Text style={s.tableHeadText}>Crédits</Text>
              </View>
              <View style={s.colStat}>
                <Text style={s.tableHeadText}>Statut</Text>
              </View>
            </View>

            {/* Rows */}
            {bulletin.notes.map((note, i) => {
              const row = i % 2 === 0 ? s.tableRow : s.tableRowAlt;
              const sc = getStatutColor(note.statut);
              return (
                <View key={note.matCode} style={row}>
                  <View style={s.colMat}>
                    <Text style={s.cellText}>{note.matLib}</Text>
                  </View>
                  <View style={s.colNum}>
                    <Text style={s.cellText}>{note.ds}</Text>
                  </View>
                  <View style={s.colNum}>
                    <Text style={s.cellText}>{note.tp ?? "—"}</Text>
                  </View>
                  <View style={s.colNum}>
                    <Text style={s.cellText}>{note.exam}</Text>
                  </View>
                  <View style={s.colNum}>
                    <Text style={[s.cellMoy, { color: getMention(note.moy).color }]}>
                      {note.moy.toFixed(1)}
                    </Text>
                  </View>
                  <View style={s.colNum}>
                    <Text style={s.cellText}>{note.coeff}</Text>
                  </View>
                  <View style={s.colNum}>
                    <Text style={s.cellText}>{note.credits}</Text>
                  </View>
                  <View style={s.colStat}>
                    <View style={[s.statPill, { backgroundColor: sc.bg }]}>
                      <Text style={[s.statPillText, { color: sc.color }]}>
                        {note.statut}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* ── Appreciation ── */}
          <View style={s.appreciationWrap}>
            <Text style={s.appreciationLabel}>Appréciation générale</Text>
            <Text style={s.appreciationText}>{bulletin.appreciation}</Text>
          </View>

          {/* ── Signatures ── */}
          <Text style={[s.sectionHead, { marginTop: 4 }]}>Visa et signatures</Text>
          <View style={s.sigRow}>
            <View style={s.sigBox}>
              <Text style={s.sigLabel}>Le Directeur</Text>
              <View style={s.sigLine} />
              <Text style={s.sigName}>Signature &amp; cachet</Text>
            </View>
            <View style={s.sigBox}>
              <Text style={s.sigLabel}>Enseignant principal</Text>
              <View style={s.sigLine} />
              <Text style={s.sigName}>Signature</Text>
            </View>
            <View style={s.sigBoxLast}>
              <Text style={s.sigLabel}>Scolarité</Text>
              <View style={s.sigLine} />
              <Text style={s.sigName}>Signature &amp; cachet</Text>
            </View>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <View style={s.footerMain}>
            <Text style={s.footerSchool}>{schoolName}</Text>
            <Text style={s.footerSub}>
              BP 1234, Yaoundé · Cameroun · contact@edustar.cm · +237 222 000 000
            </Text>
          </View>
          <View style={s.footerRight}>
            <Text style={s.footerDate}>Édité le {today}</Text>
            <Text style={s.footerConf}>Document confidentiel</Text>
          </View>
          <View style={s.qrBox}>
            <Text style={s.qrText}>QR{"\n"}CODE</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
