'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

var numberOfWork = 0;
var results = [];

/**
* @param {Array} jobs – функции, которые возвращают промисы
* @param {Number} parallelNum - число одновременно исполняющихся промисов
* @param {Number} timeout - таймаут работы промиса
* @returns {Array}
*/

function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise((resolve) => {
        if (!jobs.length) {
            resolve([]);
        }
        for (var i = 0; i < parallelNum; i++) {
            start(jobs[numberOfWork], numberOfWork++);
        }
        function start(job, index) {
            var answer = result => finish(result, index);
            new Promise((resolveJob, rejectJob) => {
                job().then(resolveJob, rejectJob);
                setTimeout(rejectJob, timeout, new Error('Error'));
            })
                .then(answer)
                .catch(answer);
        }
        function finish(result, index) {
            results[index] = result;
            if (results.length === jobs.length) {
                resolve(results);

                return;
            }
            if (numberOfWork < jobs.length) {
                start(jobs[numberOfWork], numberOfWork++);
            }
        }
    });
}
