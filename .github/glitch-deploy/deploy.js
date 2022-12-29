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


const listProject = `https://4848329e-e1a4-4d64-8b39-7f3942a3ceec@api.glitch.com/git/navy-breezy-pizza|https://4848329e-e1a4-4d64-8b39-7f3942a3ceec@api.glitch.com/git/awake-congruous-aftershave|https://4848329e-e1a4-4d64-8b39-7f3942a3ceec@api.glitch.com/git/windy-wax-coelurus|https://4848329e-e1a4-4d64-8b39-7f3942a3ceec@api.glitch.com/git/joyous-cactus-waiter|https://4848329e-e1a4-4d64-8b39-7f3942a3ceec@api.glitch.com/git/vanilla-scythe-jewel|https://4848329e-e1a4-4d64-8b39-7f3942a3ceec@api.glitch.com/git/gusty-quirky-tarantula|https://4848329e-e1a4-4d64-8b39-7f3942a3ceec@api.glitch.com/git/leeward-amplified-gaura|https://4848329e-e1a4-4d64-8b39-7f3942a3ceec@api.glitch.com/git/sturdy-valley-eocursor|https://4848329e-e1a4-4d64-8b39-7f3942a3ceec@api.glitch.com/git/cord-congruous-beast|https://4848329e-e1a4-4d64-8b39-7f3942a3ceec@api.glitch.com/git/mammoth-cumbersome-potassium|https://4848329e-e1a4-4d64-8b39-7f3942a3ceec@api.glitch.com/git/standing-speckle-plough|https://4848329e-e1a4-4d64-8b39-7f3942a3ceec@api.glitch.com/git/indigo-typhoon-drawer|https://4848329e-e1a4-4d64-8b39-7f3942a3ceec@api.glitch.com/git/voltaic-acute-request|https://4848329e-e1a4-4d64-8b39-7f3942a3ceec@api.glitch.com/git/exultant-admitted-chili`.trim().split('|');

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