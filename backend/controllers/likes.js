const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const asyncLib = require('async');

exports.likePost = (req, res, next) => {
    //getting auth header
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    //garams
    var messageId = parseInt(req.query.messageId);

    if (messageId <= 0) {
        return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
        function(done) {
            models.Message.findOne({
                    where: { id: messageId }
                })
                .then(function(messageFound) {
                    done(null, messageFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify message' });
                });
        },
        function(messageFound, done) {
            if (MessageFound) {
                models.User.findOne({
                        where: { id: userId }
                    })
                    .then(function(userFound) {
                        done(null, messageFound, userFound);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            } else {
                res.status(404).json({ 'error': 'post already liked' });
            }
        },
        function(messageFound, userFound, done) {
            if (userFound) {
                models.Like.findOne({
                        where: {
                            userId: userId,
                            messageid: messageId
                        }
                    })
                    .then(function(isUserAlreadyLiked) {
                        done(null, messageFound, userFound, isUserAlreadyLiked);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'unable to verify is user already liked' });
                    });
            } else {
                res.status(404).json({ 'error': 'user not exist' });
            }
        },
        function(messageFound, userFound, isUserAlreadyLiked, done) {
            if (!isUserAlreadyLiked) {
                messageFound.addUser(userFound)
                    .then(function(alreadyLikeFound) {
                        done(null, messageFound, userFound, isUserAlreadyLiked);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'nuable to set user reaction' });
                    });
            } else {
                res.status(409).json({ 'error': 'message already liked' });
            }
        },
        function(messageFound, userFound, done) {
            messageFound.update({
                    likes: messageFound.likes + 1
                })
                .then(function() {
                    done(messageFound);
                })
                .catch(function(err) {
                    res.status(500).json({ 'error': 'cannot update message like counter' });
                });
        },
    ], function(messageFound) {
        if (messageFound) {
            return res.status(201).json(messageFound);
        } else {
            return res.status(500).json({ 'error': 'cannot update message' });
        }
    });
}

exports.dislikePost = (req, res, next) => {
    //getting auth header
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    //garams
    var messageId = parseInt(req.query.messageId);

    if (messageId <= 0) {
        return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
        function(done) {
            models.Message.findOne({
                    where: { id: messageId }
                })
                .then(function(messageFound) {
                    done(null, messageFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify message' });
                });
        },
        function(messageFound, done) {
            if (MessageFound) {
                models.User.findOne({
                        where: { id: userId }
                    })
                    .then(function(userFound) {
                        done(null, messageFound, userFound);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            } else {
                res.status(404).json({ 'error': 'post already liked' });
            }
        },
        function(messageFound, userFound, done) {
            if (userFound) {
                models.Like.findOne({
                        where: {
                            userId: userId,
                            messageid: messageId
                        }
                    })
                    .then(function(isUserAlreadyLiked) {
                        done(null, messageFound, userFound, isUserAlreadyLiked);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'unable to verify is user already liked' });
                    });
            } else {
                res.status(404).json({ 'error': 'user not exist' });
            }
        },
        function(messageFound, userFound, isUserAlreadyLiked, done) {
            if (isUserAlreadyLiked) {
                isUserAlreadyLiked.destroy()
                    .then(function() {
                        done(null, messageFound, userFound);
                    })
                    .catch(function(err) {
                        return res.status(500).json({ 'error': 'cannot remove already liked post' });
                    });
            } else {
                done(null, messageFound, userFound);
            }
        },
        function(messageFound, userFound, done) {
            messageFound.update({
                    likes: messageFound.likes - 1
                })
                .then(function() {
                    done(messageFound);
                })
                .catch(function(err) {
                    res.status(500).json({ 'error': 'cannot update message like counter' });
                });
        },
    ], function(messageFound) {
        if (messageFound) {
            return res.status(201).json(messageFound);
        } else {
            return res.status(500).json({ 'error': 'cannot update message' });
        }
    });
}