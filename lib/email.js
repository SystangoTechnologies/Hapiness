'use strict';
const Nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates');
const Path = require('path');

exports.plugin = {
	register: async (plugin, options) => {
		const smtpTransport = Nodemailer.createTransport({
			host: options.host,
			port: options.port,
			secure: true,
			auth: {
				user: options.email,
				pass: options.password
			}
		});

		exports.sendMail = function mail(to, subject, mailbody) {
			return new Promise(async (resolve, reject) => {
				var sendMailTo = to.toLowerCase();
				var from = options.senderName + ' Team<' + options.senderEmail + '>';
				var mailOptions = {
					from: from,
					to: sendMailTo,
					subject: subject,
					text: mailbody
				};
				smtpTransport.sendMail(mailOptions, function (err) {
					if (err) {
						console.log('error', err);
						return resolve({
							sent: false,
							message: err
						});
					}
					return resolve({
						sent: true
					});
				});
			});
		};
		/* Method params
          to : emailId or comma separated emailIds to which mail needs to be send.
          templateDir : Path to directory where template html file present.
          locals : Dynamic variable pass to templated to display in email.
          attachments : attachment in email.
        */
		exports.sendMailWithTemplate = async function mail(to, templateDir, locals, attachment) {
			return new Promise(async (resolve, reject) => {
				try {
					var from = options.senderName + ' Team<' + options.senderEmail + '>';
					let attachments = [];
					console.log(Array.isArray(attachment));
					if (attachment && Array.isArray(attachment) && attachment.length > 0) {
						attachments = attachment;
					}

					const email = new EmailTemplate({
						juice: true,
						juiceResources: {
							preserveImportant: true,
							webResources: {
								//
								// this is the relative directory to your CSS/image assets
								// and its default path is `build/`:
								//
								// e.g. if you have the following in the `<head`> of your template:
								// `<link rel="stylesheet" style="style.css" data-inline" />`
								// then this assumes that the file `build/style.css` exists
								//
								relativeTo: Path.join(__dirname, '..', 'assets', 'emailAssets')
								//
								// but you might want to change it to something like:
								// relativeTo: path.join(__dirname, '..', 'assets')
								// (so that you can re-use CSS/images that are used in your web-app)
								//
							}
						},
						message: {
							from: from,
							attachments: attachments
						},
						// uncomment below to send emails in development/test env:
						send: true,
						transport: smtpTransport,
						views: {
							options: {
								extension: 'handlebars' // <---- HERE
							}
						}
					});

					await email.send({
						template: templateDir,
						message: {
							to: to
						},
						locals: locals
					});

					return resolve({
						sent: true
					});
				} catch (error) {
					console.log('error', error);
					return resolve({
						sent: false,
						message: error
					});
				}
			});
		};
	},
	pkg: require('../package.json'),
	name: 'email'
};
