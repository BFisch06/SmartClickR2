/*
* SmartClickR Question-Manager Module
* Used for handling user accounts
* Version: 0.0.1
*/


// Required Modules //
var MC = require('./my-info-config'); 
var mysql = require('mysql');

// DB Credentials //
var HOST = 'localhost';
var PORT = 3306;
var MYSQL_USER = MC.user;
var MYSQL_PASS = MC.pass;
var DATABASE = 'SmartClickR';
var TABLE = 'Questions';

// Connect to the DB //
var connection = mysql.createConnection({
	host: HOST,
	port: PORT,
	user: MYSQL_USER,
	password: MYSQL_PASS,
	database: DATABASE,
});

var answerType = {
	FR : 'FreeResponse',
	MC : 'MultipleChoice',
	TF : 'TrueFalse',
	N  : 'Numeric' 
};

var QM = {};

module.exports = QM;


// Make a new Question //
//pollid, order, questionType,
QM.newQuestion = function(questionData, callback) {
	
	QM.questionCount(questionData.Poll_ID, function(count) {
		QM.getAnswerType(questionData.AType, function(type) {
			connection.query('INSERT INTO ' + TABLE + ' (Poll_ID, AnswerType, QuestionsOrder) VALUES(?, ?, ?)', [questionData.Poll_ID, type, count + 1], function(err, results) {
				if(err) {
					console.log('Error: ', err);
					connection.destroy();
					console.log('Connection is closed');
				} else {
					callback(null);
					console.log('added new question');
				}
			});
		});
	});

}

// Get all questions of the polls //
QM.getQuestions = function(pollId, callback) {
	connection.query('SELECT * FROM ' + TABLE + ' WHERE Poll_ID = ?', [pollId], function(err, results) {
		if(results.length > 0)
			callback(results);
		else
			callback('no-questions');
	});
}

// Get a Question //
QM.getQuestion = function(questionId, callback) {
	connection.query('SELECT * FROM ' + TABLE + ' WHERE Question_ID = ?', [questionId], function(err, results) {
		if(results.length === 1) 
			callback(results);
		else
			callback('question-doesnt-exist');
	});

}

// Delete Question //
QM.delete = function(questionData, callback) {
// questionData = questionID, and pollId for now Use Order
	connection.query('DELETE from ' + TABLE + ' WHERE QuestionsOrder = ? AND Poll_ID = ?', [questionData.Order, questionData.Poll_ID], function(err, results) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback(null);
		}
	});
	
}

/****** Ajax Updating! ******/

// Update the stem //
QM.updateStem = function(questionData, callback) {
// questionData = question stem, order, pollId
	connection.query('UPDATE ' + TABLE + ' SET Stem = ? WHERE QuestionsOrder = ? AND Poll_ID = ?', [questionData.Stem, questionData.Order, questionData.Poll_ID], function(err, results) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback(null);
		}
	});

}

// Update question order //
// * Only updates the specified questionId, not the whole thing //
QM.updateOrder = function(questionData, callback) {
// questionData = order, quesitonID, and pollID
	connection.query('UPDATE ' + TABLE + ' SET QuestionsOrder = ? WHERE Poll_ID = ? AND Question_ID = ?', [questionData.Order, questionData.Poll_ID, questionData.Question_ID], function(err, results) {
		if(err) {
			console.log('Error: ', err);
			connection.destroy();
			console.log('Connection is closed');
		} else {
			callback(null);
		}
	});

}


/*****  Helper Methods  ******/


QM.questionCount = function(pollId, callback) {
	connection.query('SELECT * FROM ' + TABLE + ' WHERE Poll_ID = ?', [pollId], function(err, results) {
		if(results.length > 0)
			callback(results.length);
		else
			callback(0);
	});
}

QM.getAnswerType = function(type, callback) {
	var result;
	switch(type) {
		case 'FR':
			result = answerType.FR;
			break;
		case 'MC':
			result = answerType.MC;
			break;
		case 'TF':
			result = answerType.TF;
			break;
		case 'N':
			result = answerType.N;
			break;
	}
	callback(result);
}



QM.getQuestionID = function(questionData, callback) {
	//questionData = order and pollID
}

QM.getNumberIfString = function(item, callback) {
	var result;
	if(typeof item === "string")
		result = Number(item);
	else
		result = item;
	callback(result);
}




