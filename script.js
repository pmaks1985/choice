$(function () {
	var firstQuestionId;
	var firstQuestionAnswerId;
	$.ajax({
		url: 'https://abdpo-lk.ru/lk/ChoosingProgramAlgo/choosingprogramquestions_api_ext.php?action=getFirstQuestion',
		method: 'post',
		dataType: 'json',
		data: {},
		success: function (data) {
			$.each(data.questions, function (id, question) {
				$("#question .questionText").html(question.question);
				firstQuestionId = question.id;
				$.each(question.answers, function (id, answers) {
					$("#question .questionAnswer").append("<label><input type='radio' name='answer' id='" + answers.id + "'>" + answers.answer + " <span>" + answers.comment + "</span></label><br>")
				})
			});
			$('#questionNumber').html('Вопрос <strong>1</strong>');
			$("#nextQuestion").hide();
		}
	});

	$(".questionAnswer").on("change", "input[type=radio][name=answer]", function () { //проверка, выбран radio или нет для #next
		$("#next").prop("disabled", false);
	});

	$("#next").click(function () {
		var answerId = $('input[type=radio][name=answer]:checked').attr('id');
		firstQuestionAnswerId = answerId;
		$.ajax({
			url: 'https://abdpo-lk.ru/lk/ChoosingProgramAlgo/choosingprogramquestions_api_ext.php?action=getQuestions',
			method: 'post',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify({
				answerId
			}),
			success: function (data) {
				$.each(data.questions, function (id, question) {
					if (question.comment) {
						var comment = "<small>" + question.comment + "</small><br>";
					} else {
						var comment = "";
					}
					var html;
					if (question.id == firstQuestionId) {
						html = '<div class="question question_hidden" data-num="' + id + '">' + question.question + '<br>' + comment;
						$.each(question.answers, function (id, answer) {
							if (firstQuestionAnswerId == answer.id) {
								html = html + "<label><input type='radio' checked='checked' name='" + question.id + "' id='" + answer.id + "'>" + answer.answer + "</label><br>";
							} else {
								html = html + "<label><input type='radio' name='" + question.id + "' id='" + answer.id + "'>" + answer.answer + "</label><br>";
							}
						});
						html = html + '</div>';
					} else {
						html = '<div class="question question_visible" data-num="' + id + '">' + question.question + '<br>' + comment;
						$.each(question.answers, function (id, answer) {
							html = html + "<label><input type='radio' name='" + question.id + "' id='" + answer.id + "'>" + answer.answer + "</label><br>";
						});
						html = html + '</div>';
					}
					$(".next__question").append(html);
				});
				$("#nextQuestion").show();
				$(".question_visible:first").show();
				$("#question").hide();
				updateQuestionNumber();
			}
		});
	});

	$("body").on("click", ".question_visible label input[type=radio]", function () { //проверка, выбран radio или нет для #nextQuestion
		$("#nextQuestion").prop("disabled", false);
	});
	$("body").on("click", ".question_visible:last label input[type=radio]", function () {
		$("#get__value").prop("disabled", false);
	});

	function updateQuestionNumber() {
		let totalCount = $(".question_visible").length + 1;
		let currentNumber = $(".question_visible:visible").data('num') + 1;
		$('#questionNumber').html('Вопрос <strong>' + currentNumber + '</strong> из <strong>' + totalCount + '</strong>');
		$("#nextQuestion").prop("disabled", true);
	}

	function addProgramToTable(table, program, profession) {
		if (program.programExpire == "0") {
			var year = "Бессрочно";
		} else if (program.programExpire == "5") {
			var year = "1 раз в " + program.programExpire + " лет";
		} else if (program.programExpire == "1") {
			var year = "1 раз в год"
		} else {
			var year = "1 раз в " + program.programExpire + " года";
		}
		let programText = program.programText;
		console.log(program);
		if (program.url) {
			programText = '<a href="/' + program.url + '" target="_blank">' + programText + '</a>';
		}
		table.append("<tr class=\"program\"><td>" + ($("#programType" + program.programTypeId + " tr.program").length + 1) +
			"</td>" + "<td>" + profession.title + "<br>" + profession.comment + "</td>" + "<td>" + program.programTitle + "</td>" +
			"<td>" + programText + "</td>" + "<td>" + year + "</td>" + "<td><small>" + program.normativeDocument +
			"</small></td>" + "<td>" + program.inspector + "</td></tr>");
	}

	function addProgramTypeToTable(table, programType, profession) {
		if (programType.programTypeExpire == "0") {
			var year = "Бессрочно";
		} else if (programType.programTypeExpire == "5") {
			var year = "1 раз в " + programType.programTypeExpire + " лет";
		} else if (programType.programTypeExpire == "1") {
			var year = "1 раз в год"
		} else {
			var year = "1 раз в " + programType.programTypeExpire + " года";
		}
		let programFullName = programType.programTypeFullTitle;
		if (programType.url) {
			programFullName = '<a href="/' + programType.url + '" target="_blank">' + programFullName + '</a>';
		}
		table.append("<tr class=\"program\"><td>" + ($("#programType" + programType.programTypeId + " tr.program").length + 1) +
			"</td>" + "<td>" + profession.title + "<br>" + profession.comment + "</td>" + "<td>" + programType.programTypeTitle + "</td>" +
			"<td>" + programFullName + "</td>" + "<td>" + year + "</td>" + "<td><small>" + programType.normativeDocument +
			"</small></td>" + "<td>" + programType.inspector + "</td></tr>");
	}

	$("#nextQuestion").click(function () {
		let nextQuestion = $(".question_visible:visible").hide().next();
		nextQuestion.show();

		if (nextQuestion.next().length == 0) {
			$('#get__value').show();
			$(this).hide();
		}

		updateQuestionNumber();
	});

	$("#get__value").click(function () {
		$('.next__question').hide();
		$(".result").css("display", "block");
		var finalСhoice = [];

		$('input:radio:checked').each(function () {
				finalСhoice.push($(this).attr('id'));
			}

		);
		var firstAnswer = finalСhoice.shift();

		$.ajax({
			url: 'https://abdpo-lk.ru/lk/ChoosingProgramAlgo/choosingprogramquestions_api_ext.php?action=getResults',
			method: 'post',
			dataType: 'json',
			data: JSON.stringify({
				"answer1Id": firstAnswer,
				"answers": finalСhoice
			}),
			success: function (data) {
				$.each(data.programs, function (id, program) {
					$.each(program.professions, function (id, profession) {
						if (!program.normativeDocument) {
							program.normativeDocument = "";
						}

						if (!program.inspector) {
							program.inspector = "";
						}

						// ищем таблицу для нужного типа программ
						var table = $("#programType" + program.programTypeId);

						if (table.length == 0) {
							// если такая таблица не найдена, то
							$(".result").append("<table class='table table-bordered' id='programType" + program.programTypeId + "'><caption class='caption'>" + program.programTypeFullTitle + "</caption><tr><th rowspan='2' class='number'>№</th><th rowspan='2' class='who_is_studying'>Кто учится?</th><th colspan='2'>Программа</th><th rowspan='2' class='how_often'>Как часто?</th><th rowspan='2' class='norma'>Нормативное обоснование</th><th rowspan='2' class='checking'>Кто проверяет?</th></tr><tr><th class='code'>Код</th><th class='program'>Название программы</th></tr>");
							addProgramToTable($("#programType" + program.programTypeId), program, profession);
						} else {
							// иначе добавляем в эту конкретную таблицу строку
							addProgramToTable(table, program, profession);
						}
					});
				});
				$.each(data.programTypes, function (id, programType) {
					$.each(programType.professions, function (id, profession) {
						if (!programType.normativeDocument) {
							programType.normativeDocument = "";
						}

						if (!programType.inspector) {
							programType.inspector = "";
						}

						// ищем таблицу для нужного типа программ
						var table = $("#programType" + programType.programTypeId);

						if (table.length == 0) {
							// если такая таблица не найдена, то
							$(".result").append("<table class='table table-bordered' id='programType" + programType.programTypeId + "'><caption class='caption'>" + programType.programTypeFullTitle + "</caption><tr><th rowspan='2' class='number'>№</th><th rowspan='2' class='who_is_studying'>Кто учится?</th><th colspan='2'>Программа</th><th rowspan='2' class='how_often'>Как часто?</th><th rowspan='2' class='norma'>Нормативное обоснование</th><th rowspan='2' class='checking'>Кто проверяет?</th></tr><tr><th class='code'>Код</th><th class='program'>Название программы</th></tr>");
							addProgramTypeToTable($("#programType" + programType.programTypeId), programType, profession);
						} else {
							// иначе добавляем в эту конкретную таблицу строку
							addProgramTypeToTable(table, programType, profession);
						}
					});
				});

				$('#get__value').hide();
			}
		});
	});
});