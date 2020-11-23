$(function () {

	$.ajax({
		url: 'https://abdpo-lk.ru/lk/ChoosingProgramAlgo/choosingprogramquestions_api_ext.php?action=getFirstQuestion',
		method: 'post',
		dataType: 'json',
		data: {},
		success: function (data) {
			$.each(data.questions, function (id, question) {
				$("#question1 .questionText").html(question.question);
				$.each(question.answers, function (id, answers) {
					$("#question1 .answer").append("<input type='radio' name='answer' id='" + answers.id + "'><label for='" + answers.id + "'>" + answers.answer + "</label><br>")
				})
			});
		}
	});

	$("#next1").click(function () {
		var answerId = $('input[type=radio][name=answer]:checked').attr('id');
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
					let html = '<div class="question" data-num="' + id + '">' + question.question + '<br>';
					$.each(question.answers, function (id, answer) {
						html = html + "<input type='radio' name='" + question.id + "' id='" + answer.id + "'><label for='" + answer.id + "'>" + answer.answer + "</label><br>";
					});
					html = html + '</div>';
					$(".next__question").append(html);
				});
				$(".question:first").show();
				$("#question1").hide();
				updateQuestionNumber();
			}
		});
	});

	function updateQuestionNumber() {
		let totalCount = $(".question").length;
		let currentNumber = $(".question:visible").data('num') + 1;
		$('#questionNumber').html('Вопрос <strong>' + currentNumber + '</strong> из <strong>' + totalCount + '</strong>');
	}

	function addProgramToTable(table, program, profession) {
		table.append("<tr class=\"program\"><td>" + ($("#programType" + program.programTypeId + " tr.program").length + 1) + "</td>" + "<td>" + profession.title + "<br>" + profession.comment + "</td>" +
			"<td>" + program.programTitle + "</td>" + "<td>" + program.programText + "</td>" + "<td>Как часто?</td>" + "<td>" +
			program.normativeDocument + "</td>" + "<td>" + program.inspector + "</td></tr>");
	}

	$("#next2").click(function () {
		let nextQuestion = $(".question:visible").hide().next();
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
		});
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

						/*if (program.normativeDocument === null) {
							normativeDocument == "";
						}
						if (program.inspector === null) {
							inspector == "";
						}*/
						// ищем таблицу для нужного типа программ
						var table = $("#programType" + program.programTypeId);
						if (table.length == 0) {
							// если такая таблица не найдена, то
							$(".result").append("<table class='table table-bordered' id='programType" + program.programTypeId + "'><tr><td colspan='7'>" +
								program.programTypeFullTitle + "</td></tr><tr><td rowspan='2'>№</td><td rowspan='2'>Кто учится?</td><td colspan='2'>Программа</td><td rowspan='2'>Как часто?</td><td rowspan='2'>Нормативное обоснование</td><td rowspan='2'>Кто проверяет?</td></tr><tr><td>Код</td><td>Название программы</td></tr>");
							addProgramToTable($("#programType" + program.programTypeId), program, profession);
						} else {
							// иначе добавляем в эту конкретную таблицу строку
							addProgramToTable(table, program, profession);
						}
					});
				});
				$('#get__value').hide();
			}
		});

	});
});