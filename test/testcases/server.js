const chai = require('chai');
const should = chai.should;
const expect = chai.expect;
should();
const Path = require('path');
const Manifest = require('../../config/manifest');
const composeOptions = {
    relativeTo: Path.join(__dirname, '../../')
};
const Glue = require('glue');
const utils = require('./utils');
let context = utils.context;
var supertest = require('supertest');

describe('compose()', () => {
    console.log('--------------------------server - compose--------------------------');
    it('composes a server using manifest', async () => {
        var server = await Glue.compose(Manifest.get('/'), composeOptions);
        context.request = supertest(server.listener);
        expect(server.info.port).to.equal(8000);
    });
});