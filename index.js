const axios = require("axios");
const diffParse = require("parse-git-diff");
const { exec } = require("child_process");

/**
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
	app.log.info("Yay, the app was loaded!");

	app.on(
		["pull_request.opened", "pull_request.synchronize"],
		async (context) => {
			const diffUrl = context.payload.pull_request.diff_url;

			const res = await axios.get(diffUrl);
			const parsed = diffParse(res.data);

			if (
				parsed.files.length != 1 ||
				parsed.files[0].path != process.env.CHANGE_FILE
			) {
				return context.octokit.issues.createComment(
					context.issue({
						body: `Please only edit ${process.env.CHANGE_FILE}. You can make a commit to undo the invalid changes.`,
					})
				);
			}

			const diff = parsed.files[0];

			// check for invalid changes
			for (const chunk of diff.chunks) {
				for (const change of chunk.changes) {
					if (change.type !== "UnchangedLine" && change.type !== "AddedLine") {
						return context.octokit.issues.createComment(
							context.issue({
								body: `Please only add new lines. Raise an issue if you'd like to remove a line.`,
							})
						);
					}
					if (change.type === "AddedLine") {
						const line = change.content;
						//prevent imports
						if (
							/\s*import\s+.*\s*.*/.test(line) ||
							/\s*from\s+.*\s+import\s+.*/.test(line) ||
							/\s*done\(\)\s*.*/.test(line)
						) {
							return context.octokit.issues.createComment(
								context.issue({
									body: `Might wanna take a look at the rules.`,
								})
							);
						}
					}
				}
			}

			const prRepo = context.payload.pull_request.head.repo.html_url;
			const branch = context.payload.pull_request.head.ref;

			//check for execution time
			const pixelDiff = await new Promise((resolve, reject) => {
				exec(`./test.sh "${prRepo}" "${branch}"`, (_, stdout) => {
					resolve(Number.parseInt(stdout));
				});
			});

			if (pixelDiff > 50000) {
				return context.octokit.issues.createComment(
					context.issue({
						body: `Please take care not edit more than 10000 pixels per commit.`,
					})
				);
			}
			if (pixelDiff == -1) {
				return context.octokit.issues.createComment(
					context.issue({
						body: `draw.js has errors. Please fix.`,
					})
				);
			}
			if (pixelDiff == -2) {
				return context.octokit.issues.createComment(
					context.issue({
						body: `Please remove any long running/infinite loops.`,
					})
				);
			}

			try {
				const mergeRes = await context.octokit.pulls.merge(
					context.repo({ 
						pull_number: context.payload.pull_request.number ,
						merge_method: 'squash',
					})
				);
				exec("./updatesite.sh")
				// exec("(cp /tmp/screenshot1.png /home/cliford/place/canvas.png)");
				return mergeRes;
			} catch (err) {
				console.log(err.message)
				return context.octokit.issues.createComment(
					context.issue({
						body: `Please resolve all merge conflicts.`,
					})
				);
			}
		}
	);
};
