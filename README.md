# placebot

A GitHub App built with [Probot](https://github.com/probot/probot) as part of the place.git event during FOSSMeet'23. This bot was used to auto-merge the PRs made to the canvas repo.

### Note
- The bot enforces the rules mentioned in the canvas repo, but did run into some minor issues with respect to the pixel count towards the end.
- The bot was designed to work on a headless server and works with an Xorg virtual framebuffer as a display.
- This whole thing was hacked together in the span of a day and is a lot of duct-tape code. Pls don't judge.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```


