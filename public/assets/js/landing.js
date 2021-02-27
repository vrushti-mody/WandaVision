var slider = document.getElementById('input-slider');

  console.log(slider);
  var options = {
    start: [60],
    step: 10,
    range: {
        'min': [20],
        'max': [120]
    }
  }
  //slider.noUiSlider.updateOptions(options, true /* Allow destruction + rebuilding */ );
  $("body").on('DOMSubtreeModified', "#input-slider-value", function () {
    var raw_duration = $('#input-slider-value').text();
    console.log(raw_duration);
    $('#duration').val(Math.round(parseFloat(raw_duration)));
  })

  var goalIndex = 0;

  var addGoal = function() {
    console.log("add new task");
    var tasks = $('.tasks-list');
    var newTask = $('.task-form-group').first().clone();
    newTask.attr("id", ++goalIndex);
    newTask.find(".delete-goal-button i").attr('onclick', "deleteGoal(" + goalIndex + ")");
    newTask.find(".task-description").val("");
    tasks.append(newTask);
  }

  var deleteGoal = function(id) {
    console.log("delete new task");
    var tasks = $('.task-form-group');
    if (tasks.length == 1) return;
    $('.task-form-group#' + id).remove();
  }

  var submitForm = function() {
    console.log("CREATE TASKS")
    var tasksArray = $("#tasks-array");

    for (taskGroup of $('.task-form-group')) {
      var taskDescription = $(taskGroup).find(".task-description").val();
      var taskPriority = $(taskGroup).find(".task-select-priority").val();

      var oldTasksArray = tasksArray.first().val();
      tasksArray.first().val(oldTasksArray + taskDescription + '(' + taskPriority + ')|');
    }
    console.log(tasksArray);
     this._submit();
  };
