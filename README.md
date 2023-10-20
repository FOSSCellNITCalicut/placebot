# placebot2

A fork of a GitHub App built with [Probot](https://github.com/probot/probot) as part of the place.git event during FOSSMeet'23. This bot was used to auto-merge the PRs made to the canvas repo.

### Note
- The bot enforces the rules mentioned in the canvas repo, but did run into some minor issues with respect to the pixel count towards the end.
- Bot has been remade to use evaluate turtle-js code


### TODO
- [ ] Prevent users from writing js code which can change the DOM, i.e only allow turtle commands
- [ ] Suggest generic commands to fix ?
- [ ] Code Quality improvements ?

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```


