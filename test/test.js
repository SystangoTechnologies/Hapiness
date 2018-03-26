const utils = require('./testcases/utils');

describe('Users', () => {
    before((done) => {
        console.log('--------------------------before hook start--------------------------');
        utils.cleanDb()
            .then(async function() {
                console.log('--------------------------before hook complete--------------------------');
                done();
            }).catch(function(err) {
                console.log('error in before hook: ', err);
            });
    });

    after((done) => {
        console.log('--------------------------after hook start--------------------------');
        utils.cleanDb()
            .then(function() {
                console.log('--------------------------after hook complete--------------------------');
                done();
            }).catch(function(err) {
                console.log('error in after hook: ', err);
            });
    });

    describe('Test cases', () => {
        /* Require all the test cases files here and they will be executed in the same order */

        console.log('--------------------------test cases start--------------------------');
        require('./testcases/server.js');
        require('./testcases/users.js');
        console.log('--------------------------test cases completed--------------------------');
    });
});