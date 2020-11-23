$(function () {

	$.ajax({
		url: 'https://abdpo-lk.ru/lk/ChoosingProgramAlgo/choosingprogramquestions_api_ext.php?action=getFirstQuestion',
		method: 'post',
		dataType: 'json',
		data: {},
		success: function (data) {
			$.each(data.questions, function (id, question) {
				$(".question").append(question.question);
				$.each(question.answers, function (id, answers) {
					$(".answer").append("<input type='radio' name='answer' id='" + answers.id + "'><label for='" + answers.id + "'>" + answers.answer + "</label><br>")
				})
			});
		}
	});

	$("#next").click(function () {
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
					$(".next__question").append("<div class='text__question d-none' id='question__" + question.id + "'><p>" + question.question + "</p></div>");
					if (id < 1) {
						$(".text__question").removeClass("d-none");
					}
					$.each(question.answers, function (id, answer) {
						$(".text__question").append("<input type='radio' name='" + question.id + "' id='" + answer.id + "'><label for='" + answer.id + "'>" + answer.answer + "</label><br>");
					});
				});
			}
		});
		$("#get__value").css("display", "block");
	});

	function addProgramToTable(table, program, profession) {
		table.append("<tr class=\"program\"><td>" + ($("#programType" + program.programTypeId + " tr.program").length + 1) + "</td>" + "<td>" + profession.title + "<br>" + profession.comment + "</td>" +
			"<td>" + program.programTitle + "</td>" + "<td>" + program.programText + "</td>" + "<td>Как часто?</td>" + "<td>" +
			program.normativeDocument + "</td>" + "<td>" + program.inspector + "</td></tr>");
	}

	$("#get__value").click(function () {
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
			}
		});

	});
});