const fs = require('fs');
const path = require('path');

async function main() {
  const issueUser = process.env.ISSUE_USER;
  const issueBody = process.env.ISSUE_BODY || '';
  
  if (!issueUser) {
    console.error("No issue user provided.");
    process.exit(1);
  }

  const readmePath = path.join(__dirname, '../README.md');
  if (!fs.existsSync(readmePath)) {
    console.error("README.md not found at path:", readmePath);
    process.exit(1);
  }
  let readmeContent = fs.readFileSync(readmePath, 'utf8');

  // Sanitize message: remove HTML tags, keep single line, cap length at 100 characters
  let cleanMessage = issueBody
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[\r\n]+/g, ' ') // remove linebreaks
    .trim();
    
  if (cleanMessage.length > 100) {
    cleanMessage = cleanMessage.substring(0, 97) + '...';
  }
  
  if (!cleanMessage) {
    cleanMessage = 'Signed the guestbook!';
  }

  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const signatureRow = `| [@${issueUser}](https://github.com/${issueUser}) | ${formattedDate} | ${cleanMessage} |`;

  // Locate the guestbook placeholders
  const guestbookStartTag = '<!-- GUESTBOOK_START -->';
  const guestbookEndTag = '<!-- GUESTBOOK_END -->';

  const startIndex = readmeContent.indexOf(guestbookStartTag);
  const endIndex = readmeContent.indexOf(guestbookEndTag);

  if (startIndex === -1 || endIndex === -1) {
    console.error("Guestbook placeholders not found in README.md");
    process.exit(1);
  }

  const beforeGuestbook = readmeContent.substring(0, startIndex + guestbookStartTag.length);
  const afterGuestbook = readmeContent.substring(endIndex);
  let guestbookBody = readmeContent.substring(startIndex + guestbookStartTag.length, endIndex).trim();

  // If table headers don't exist yet, initialize them
  if (!guestbookBody.includes('| Visitor | Date | Message |')) {
    guestbookBody = `
| Visitor | Date | Message |
| :--- | :--- | :--- |`;
  }

  const lines = guestbookBody.split('\n');
  lines.push(signatureRow);
  
  // Keep headers + latest 10 signatures
  const headerLines = lines.slice(0, 3); // table header lines
  let dataLines = lines.slice(3).filter(line => line.trim().length > 0);
  
  // Limit to latest 10 signatures to keep profile README clean
  if (dataLines.length > 10) {
    dataLines = dataLines.slice(dataLines.length - 10);
  }
  
  const updatedGuestbookBody = `\n${headerLines.join('\n')}\n${dataLines.join('\n')}\n`;

  const finalReadme = beforeGuestbook + updatedGuestbookBody + afterGuestbook;
  fs.writeFileSync(readmePath, finalReadme, 'utf8');
  console.log(`Successfully added guestbook entry for ${issueUser}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});