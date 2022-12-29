const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://31556266-2f81-4f70-bac5-9bfe413b6248@api.glitch.com/git/luminous-awesome-bun|https://31556266-2f81-4f70-bac5-9bfe413b6248@api.glitch.com/git/aboard-silky-pigeon|https://31556266-2f81-4f70-bac5-9bfe413b6248@api.glitch.com/git/quixotic-ambitious-viola|https://31556266-2f81-4f70-bac5-9bfe413b6248@api.glitch.com/git/olivine-energetic-fly|https://31556266-2f81-4f70-bac5-9bfe413b6248@api.glitch.com/git/root-highfalutin-utahceratops|https://31556266-2f81-4f70-bac5-9bfe413b6248@api.glitch.com/git/cream-amused-earth|https://31556266-2f81-4f70-bac5-9bfe413b6248@api.glitch.com/git/lava-ahead-hole|https://31556266-2f81-4f70-bac5-9bfe413b6248@api.glitch.com/git/chiseled-neat-primrose|https://31556266-2f81-4f70-bac5-9bfe413b6248@api.glitch.com/git/faint-shell-lute|https://31556266-2f81-4f70-bac5-9bfe413b6248@api.glitch.com/git/vine-good-sandwich|https://31556266-2f81-4f70-bac5-9bfe413b6248@api.glitch.com/git/foil-wistful-sheep|https://31556266-2f81-4f70-bac5-9bfe413b6248@api.glitch.com/git/tarry-fluff-bonsai|https://31556266-2f81-4f70-bac5-9bfe413b6248@api.glitch.com/git/organized-crimson-cinema|https://31556266-2f81-4f70-bac5-9bfe413b6248@api.glitch.com/git/awake-likeable-meteoroid`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();