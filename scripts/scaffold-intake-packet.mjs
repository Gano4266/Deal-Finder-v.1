import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  csvIntakeFiles,
  repoRoot,
  requiredIntakeFiles,
  templateByFile
} from "./research-intake-contract.mjs";

const currentFilePath = fileURLToPath(import.meta.url);
const intakeRoot = "ops/research/intake";

function slugify(input) {
  return String(input ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleizeSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function todayInWilmington() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function parseArgs(rawArgs) {
  const options = {
    dryRun: false,
    date: todayInWilmington(),
    areaName: undefined
  };
  const positional = [];

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--date") {
      const date = rawArgs[index + 1];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
        throw new Error("--date requires YYYY-MM-DD");
      }
      options.date = date;
      index += 1;
      continue;
    }

    if (arg === "--area-name") {
      const areaName = rawArgs[index + 1];
      if (!areaName) {
        throw new Error("--area-name requires a value");
      }
      options.areaName = areaName;
      index += 1;
      continue;
    }

    if (arg.startsWith("--")) {
      throw new Error(`Unknown intake scaffold option: ${arg}`);
    }

    positional.push(arg);
  }

  return {
    area: positional[0],
    options
  };
}

function csvHeaderFor(fileName, root = repoRoot) {
  const template = templateByFile.get(fileName);
  if (!template) {
    throw new Error(`No template registered for ${fileName}`);
  }

  const text = fs.readFileSync(path.join(root, template), "utf8").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return `${text.split("\n")[0]}\n`;
}

function areaBrief({ areaName, areaSlug, date }) {
  return {
    area_name: areaName,
    research_mode: "operator_scaffold_empty_intake",
    market_scope: areaName,
    created_at: date,
    notes: [
      "Empty scaffold only. No restaurant research, scraping, external API calls, screenshots, archives, direct confirmations, approvals, or fixture promotion were performed.",
      "AI output is not evidence. Rows must remain leads or review candidates until official evidence or direct confirmation is captured and human reviewed.",
      `Canonical intake slug: ${areaSlug}-${date}.`
    ]
  };
}

function readmeText({ intakeRelativePath }) {
  return [
    "# Research Intake Packet",
    "",
    "Empty scaffold only. Fill rows from reviewed operator research, official captures, or direct confirmations.",
    "",
    "Useful commands:",
    "",
    "```bash",
    `npm run research:validate -- ${intakeRelativePath}`,
    `npm run ops -- scrape ${intakeRelativePath} --dry-run`,
    `npm run ops -- readiness ${intakeRelativePath}`,
    `npm run ops -- promote:plan ${intakeRelativePath}`,
    "```",
    "",
    "Do not put raw private evidence, credentials, personal information, or unreviewed screenshots in committed files.",
    ""
  ].join("\n");
}

export function buildIntakeScaffoldPlan({ area, options = {}, root = repoRoot, templateRoot = repoRoot }) {
  const areaSlug = slugify(area);
  if (!areaSlug) {
    throw new Error("intake:new requires an area slug, for example wilmington or downtown-wilmington");
  }

  const date = options.date ?? todayInWilmington();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("date must be YYYY-MM-DD");
  }

  const areaName = options.areaName ?? titleizeSlug(areaSlug);
  const folderName = `${areaSlug}-${date}`;
  const intakeRelativePath = `${intakeRoot}/${folderName}`;
  const intakeDir = path.join(root, intakeRelativePath);
  const files = [
    {
      relativePath: `${intakeRelativePath}/area_brief.json`,
      content: `${JSON.stringify(areaBrief({ areaName, areaSlug, date }), null, 2)}\n`
    },
    ...csvIntakeFiles.map((fileName) => ({
      relativePath: `${intakeRelativePath}/${fileName}`,
      content: csvHeaderFor(fileName, templateRoot)
    })),
    {
      relativePath: `${intakeRelativePath}/README.md`,
      content: readmeText({ intakeRelativePath })
    },
    {
      relativePath: `${intakeRelativePath}/raw/.gitkeep`,
      content: ""
    },
    {
      relativePath: `${intakeRelativePath}/screenshots/.gitkeep`,
      content: ""
    }
  ];

  return {
    area,
    areaSlug,
    areaName,
    date,
    intakeRelativePath,
    intakeDir,
    requiredFiles: requiredIntakeFiles,
    csvFiles: csvIntakeFiles,
    files
  };
}

export function createIntakeScaffold({ area, options = {}, root = repoRoot, templateRoot = repoRoot }) {
  const plan = buildIntakeScaffoldPlan({ area, options, root, templateRoot });

  if (fs.existsSync(plan.intakeDir)) {
    throw new Error(`intake folder already exists: ${plan.intakeRelativePath}`);
  }

  if (options.dryRun) {
    return { ...plan, created: false };
  }

  fs.mkdirSync(plan.intakeDir, { recursive: true });
  plan.files.forEach((file) => {
    const absolutePath = path.join(root, file.relativePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, file.content, "utf8");
  });

  return { ...plan, created: true };
}

function printPlan(result) {
  console.log(`Intake scaffold: ${result.intakeRelativePath}`);
  console.log(result.created ? "Created empty intake packet." : "Dry run only. No files written.");
  console.log("");
  console.log("Files");
  result.files.forEach((file) => console.log(`- ${file.relativePath}`));
  console.log("");
  console.log("Next commands");
  console.log(`- npm run research:validate -- ${result.intakeRelativePath}`);
  console.log(`- npm run ops -- scrape ${result.intakeRelativePath} --dry-run`);
  console.log(`- npm run ops -- readiness ${result.intakeRelativePath}`);
}

function runCli() {
  const rawArgs = process.argv.slice(2);
  if (rawArgs.includes("--help") || rawArgs.includes("-h")) {
    console.log("Usage: node scripts/scaffold-intake-packet.mjs <area-slug> [--date YYYY-MM-DD] [--area-name \"Area Name\"] [--dry-run]");
    process.exit(0);
  }

  try {
    const { area, options } = parseArgs(rawArgs);
    const result = createIntakeScaffold({ area, options });
    printPlan(result);
  } catch (error) {
    console.error(`Intake scaffold failed: ${error.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  runCli();
}
