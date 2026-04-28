// ─── HTML Email Template for Interview Results ───

interface EmailData {
  candidateName: string;
  overallScore: number;
  clarity: number;
  patience: number;
  fluency: number;
  warmth: number;
  simplicity: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  interviewId: string;
  appUrl: string;
}

function getGrade(score: number): string {
  if (score >= 9) return "A+";
  if (score >= 8) return "A";
  if (score >= 7) return "B+";
  if (score >= 6) return "B";
  if (score >= 5) return "C";
  return "D";
}

function scoreColor(score: number): string {
  if (score >= 8) return "#bcff5f";
  if (score >= 6) return "#00ffff";
  if (score >= 4) return "#ff51fa";
  return "#ff7351";
}

export function buildEvaluationHTML(data: EmailData): string {
  const dims = [
    { label: "Clarity", score: data.clarity, icon: "💎" },
    { label: "Patience", score: data.patience, icon: "🌱" },
    { label: "Fluency", score: data.fluency, icon: "🗣️" },
    { label: "Warmth", score: data.warmth, icon: "🤗" },
    { label: "Simplicity", score: data.simplicity, icon: "✨" },
  ];

  const dimRows = dims
    .map(
      (d) => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #2c2c2c;color:#ababab;font-size:14px;">
        ${d.icon} ${d.label}
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #2c2c2c;text-align:center;font-size:20px;font-weight:900;color:${scoreColor(d.score)};">
        ${d.score}
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #2c2c2c;text-align:center;font-size:12px;color:#757575;">
        ${getGrade(d.score)}
      </td>
    </tr>`
    )
    .join("");

  const strengthsList = data.strengths
    .map(
      (s) =>
        `<li style="padding:6px 0;color:#ababab;font-size:13px;">
          <span style="color:#bcff5f;font-weight:700;">✓</span> ${s}
        </li>`
    )
    .join("");

  const improvementsList = data.improvements
    .map(
      (imp) =>
        `<li style="padding:6px 0;color:#ababab;font-size:13px;">
          <span style="color:#ff51fa;font-weight:700;">→</span> ${imp}
        </li>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#0e0e0e;border:4px solid #484848;">

          <!-- Header -->
          <tr>
            <td style="background-color:#000000;padding:24px 32px;border-bottom:4px solid #bcff5f;">
              <table width="100%">
                <tr>
                  <td>
                    <span style="font-size:24px;font-weight:900;color:#bcff5f;letter-spacing:-0.05em;text-transform:uppercase;">NOVAAI</span>
                    <br/>
                    <span style="font-size:10px;color:#757575;text-transform:uppercase;letter-spacing:0.15em;">EVALUATION_REPORT // ${new Date().toLocaleDateString()}</span>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <span style="font-size:10px;color:#00ffff;text-transform:uppercase;letter-spacing:0.1em;">ID: ${data.interviewId.slice(0, 8).toUpperCase()}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 32px 16px;">
              <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;text-transform:uppercase;">
                Hi ${data.candidateName},
              </p>
              <p style="margin:8px 0 0;color:#ababab;font-size:14px;line-height:1.6;">
                Your interview with Nova has been evaluated. Here are your results:
              </p>
            </td>
          </tr>

          <!-- Overall Score -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" style="background-color:#191919;border:4px solid ${scoreColor(data.overallScore)};">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <div style="font-size:10px;color:#757575;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px;">OVERALL SCORE</div>
                    <div style="font-size:56px;font-weight:900;color:${scoreColor(data.overallScore)};line-height:1;">${data.overallScore}</div>
                    <div style="font-size:18px;font-weight:700;color:${scoreColor(data.overallScore)};margin-top:4px;">GRADE: ${getGrade(data.overallScore)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dimension Scores -->
          <tr>
            <td style="padding:0 32px 24px;">
              <div style="font-size:10px;color:#bcff5f;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:12px;font-weight:700;">DIMENSION BREAKDOWN</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#191919;border:2px solid #2c2c2c;">
                <tr style="background-color:#131313;">
                  <td style="padding:8px 16px;font-size:10px;color:#757575;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Metric</td>
                  <td style="padding:8px 16px;text-align:center;font-size:10px;color:#757575;text-transform:uppercase;font-weight:700;">Score</td>
                  <td style="padding:8px 16px;text-align:center;font-size:10px;color:#757575;text-transform:uppercase;font-weight:700;">Grade</td>
                </tr>
                ${dimRows}
              </table>
            </td>
          </tr>

          <!-- Summary -->
          <tr>
            <td style="padding:0 32px 24px;">
              <div style="font-size:10px;color:#00ffff;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px;font-weight:700;">SUMMARY</div>
              <p style="margin:0;color:#ababab;font-size:14px;line-height:1.7;background-color:#191919;padding:16px;border-left:4px solid #00ffff;">
                ${data.summary}
              </p>
            </td>
          </tr>

          <!-- Strengths -->
          ${
            data.strengths.length > 0
              ? `
          <tr>
            <td style="padding:0 32px 24px;">
              <div style="font-size:10px;color:#bcff5f;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px;font-weight:700;">💪 STRENGTHS</div>
              <ul style="margin:0;padding:0 0 0 8px;list-style:none;">
                ${strengthsList}
              </ul>
            </td>
          </tr>`
              : ""
          }

          <!-- Improvements -->
          ${
            data.improvements.length > 0
              ? `
          <tr>
            <td style="padding:0 32px 24px;">
              <div style="font-size:10px;color:#ff51fa;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px;font-weight:700;">🎯 IMPROVEMENTS</div>
              <ul style="margin:0;padding:0 0 0 8px;list-style:none;">
                ${improvementsList}
              </ul>
            </td>
          </tr>`
              : ""
          }

          <!-- CTA -->
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <a href="${data.appUrl}/results/${data.interviewId}" style="display:inline-block;padding:14px 32px;background-color:#bcff5f;color:#000000;font-size:13px;font-weight:800;text-transform:uppercase;text-decoration:none;letter-spacing:0.02em;border:4px solid #000000;">
                VIEW FULL REPORT →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#000000;padding:20px 32px;border-top:2px solid #2c2c2c;">
              <table width="100%">
                <tr>
                  <td>
                    <span style="font-size:12px;font-weight:900;color:#bcff5f;">NOVAAI</span>
                    <span style="font-size:10px;color:#484848;"> // AI-POWERED INTERVIEWS</span>
                  </td>
                  <td align="right">
                    <span style="font-size:9px;color:#484848;">AUTOMATED EVALUATION SYSTEM V4.2</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
