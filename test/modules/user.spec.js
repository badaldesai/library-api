const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const user = require('../../src/modules/user');
const userModel = require('../../src/database/models/user');

const UNAUTHORIZED_CODE = 401;
const CONFLICT_CODE = 409;

describe('modules.user', function () {
	afterEach(function () {
		jest.clearAllMocks();
	});

	describe('modules.user.register', function () {
		const body = {};
		beforeEach(function () {
			jest.spyOn(userModel, 'findOne').mockImplementation();
			jest.spyOn(userModel, 'create').mockImplementation();
			jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'cryptohash');
			jest.spyOn(jwt, 'sign').mockImplementation(() => 'token123');
			body.first_name = 'first';
			body.last_name = 'last';
			body.username = 'username';
			body.password = 'pass';
		});
		test('should throw and error if findOne throws error', function () {
			userModel.findOne.mockImplementation(() => { throw new Error('Mongodb Error'); });
			return expect(user.register(body)).rejects.toThrow('Mongodb Error');
		});
		test('should repsonse with CONFLICT_CODE status if user exists', function () {
			userModel.findOne.mockImplementation(() => ({
				username: 'username2',
			}));
			return expect(user.register(body)).rejects.toMatchObject({
				isBoom: true,
				output: {
					statusCode: CONFLICT_CODE,
					payload: {
						error: 'Conflict',
						message: 'User Already Exist. Please Login',
						statusCode: CONFLICT_CODE,
					},
				},
			});
		});
		test('should response with user model if user is sucessful register', function () {
			userModel.create.mockImplementation(() => ({
				username: 'username2',
				_id: 'userId',
			}));
			return expect(user.register(body)).resolves.toMatchObject({
				username: 'username2',
				_id: 'userId',
				token: 'token123',
			});
		});
	});

	describe('modules.user.login', function () {
		const body = { username: 'username', password: 'pass' };
		beforeEach(function () {
			jest.spyOn(userModel, 'findOne').mockImplementation();
			jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
			jest.spyOn(jwt, 'sign').mockImplementation(() => 'token123');
		});
		test('should throw and error if findOne throws error', function () {
			userModel.findOne.mockImplementation(() => { throw new Error('Mongodb Error'); });
			return expect(user.login(body)).rejects.toThrow('Mongodb Error');
		});
		test('should repsonse with UNAUTHORIZED_CODE status if password is false', function () {
			userModel.findOne.mockImplementation(() => ({
				username: 'username',
				_id: 'userId',
			}));
			jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);
			return expect(user.login(body)).rejects.toMatchObject({
				isBoom: true,
				output: {
					statusCode: UNAUTHORIZED_CODE,
					payload: {
						error: 'Unauthorized',
						message: 'User is not authenticated',
						statusCode: UNAUTHORIZED_CODE,
					},
				},
			});
		});
		test('should repsonse with UNAUTHORIZED_CODE status if user don\'t exists', function () {
			return expect(user.login(body)).rejects.toMatchObject({
				isBoom: true,
				output: {
					statusCode: UNAUTHORIZED_CODE,
					payload: {
						error: 'Unauthorized',
						message: 'User is not authenticated',
						statusCode: UNAUTHORIZED_CODE,
					},
				},
			});
		});
		test('should response with user model if user is sucessful register', function () {
			userModel.findOne.mockImplementation(() => ({
				username: 'username2',
				_id: 'userId',
			}));
			return expect(user.login(body)).resolves.toMatchObject({
				username: 'username2',
				_id: 'userId',
				token: 'token123',
			});
		});
	});
});
