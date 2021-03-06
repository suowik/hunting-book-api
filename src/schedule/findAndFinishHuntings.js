let schedule = require('node-schedule');
let moment = require('moment');


async function findAndFinishHuntings(huntingRepository) {
    let now = moment();
    let huntings = await huntingRepository.findAll(null, {status: 'started'});
    huntings.forEach(hunting => {
        console.log(hunting)
        let endOfHunting = moment(hunting.end);
        if (now.isAfter(endOfHunting)) {
            console.log("finishing:")
            console.log(hunting)
            huntingRepository.finish({_id: hunting._id, end: hunting.end})
        }

    })
}

function findAndFinishHuntingsJob(huntingRepository) {
    return () => {
        schedule.scheduleJob("*/5 * * * *", async () => {
            await findAndFinishHuntings(huntingRepository)
        });
    }
}

module.exports = {
    findAndFinishHuntingsJob: findAndFinishHuntingsJob,
    findAndFinishHuntings: findAndFinishHuntings
};


