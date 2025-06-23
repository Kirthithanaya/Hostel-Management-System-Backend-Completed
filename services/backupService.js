import { exec } from "child_process";

export const backupDatabase = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = `./backups/backup-${timestamp}`;

  exec(`mongodump --db hostelDB --out ${backupPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("Backup failed:", stderr);
    } else {
      console.log("Backup successful:", stdout);
    }
  });
};
