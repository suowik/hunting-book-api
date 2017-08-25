let schedule = require('node-schedule');
let moment = require('moment');


function findAndFinishHuntingsJob(huntingRepository) {
    return () => {
        schedule.scheduleJob("* */10 * * * *", () => {
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
        });
    }
}

module.exports = {
    findAndFinishHuntingsJob: findAndFinishHuntingsJob
};


