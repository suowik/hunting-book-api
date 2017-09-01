let schedule = require('node-schedule');
let moment = require('moment');


function findAndFinishHuntings(huntingRepository){
    let now = moment();
    huntingRepository.findAll(null, {status:'started'})
        .then((huntings) => {
            huntings.forEach(hunting => {
                let endOfHunting = moment(hunting.end);
                if (now.isAfter(endOfHunting)) {
                    huntingRepository.finish({_id: hunting._id, end: hunting.end})
                }

            })
        })
        .catch(e => {
            console.log(e)
        });
}

function findAndFinishHuntingsJob(huntingRepository) {
    return () => {
        schedule.scheduleJob("* */5 * * * *", () => {
            findAndFinishHuntings(huntingRepository)
        });
    }
}

module.exports = {
    findAndFinishHuntingsJob: findAndFinishHuntingsJob,
    findAndFinishHuntings: findAndFinishHuntings
};


