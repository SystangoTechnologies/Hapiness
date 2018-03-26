var chai = require('chai');
var should = chai.should;
var expect = chai.expect;
should();
const utils = require('./utils');
let context = utils.context;
describe('Users', async () => {
    describe('POST /api/v1/signUp',  () => {
        console.log('--------------------------users - signup--------------------------');        
        it('should not create a new user as password and confirm password doest not match', (done) => {
            context.request
                .post(context.api+'/signUp')
                .set('content-type', 'application/json')
                .send({
                    email: context.email,
                    password: context.password,
                    confirmPassword: '123456',
                    name: context.name
                  })
                .expect(401, done);
        });
        it('should not create a new user as required field missing', (done) => {
            context.request
                .post(context.api+'/signUp')
                .set('content-type', 'application/json')
                .send({
                    email: context.email,
                    password: context.password,
                    confirmPassword: context.password
                  })
                .expect(400, done);
        });
        it('should create a new user', (done) => {
            context.request
                .post(context.api+'/signUp')
                .set('content-type', 'application/json')
                .send({
                    email: context.email,
                    password: context.password,
                    confirmPassword: context.password,
                    name: context.name
                  })
                .expect(201, (err, res) => {
                    if(err){
                        return done(err);
                    }
                    context.token = res.headers.authorization;
                    done();
                });
        });
    });
    describe('POST /api/v1/login',  () => {
        console.log('--------------------------users - login--------------------------');        
        it('should not login as email password is not valid', (done) => {
            context.request
                .post(context.api+'/login')
                .set('content-type', 'application/json')
                .send({
                    email: context.email,
                    password: '123456',
                })
                .expect(401, done);
        });
        it('should log in with email and password', (done) => {
            context.request
                .post(context.api+'/login')
                .set('content-type', 'application/json')
                .send({
                    email: context.email,
                    password: context.password,
                })
                .expect(200, (err, res) => {
                    if(err){
                        return done(err);
                    }
                    context.token = res.headers.authorization;
                    done();
                });
        });
    }); 
});