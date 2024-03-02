var taskInput = document.getElementById("taskInput");
var taskInputBtn = document.getElementById("taskInputBtn");
var totaltaskBtn = document.getElementById("totaltask");
//전체리스트
var taskInputList = []; //객체 데이터를 담을 배열
var selectedIds = []; //id 데이터만 담을 배열
//전체 또는 개인 체크박스
var totalCheckBtn = function () {
    var allChecked = taskInputList.every(function (it) { return it.isComplete; });
    taskInputList.forEach(function (it) {
        it.isComplete = !allChecked;
        var checkbox = document.getElementById(it.id);
        if (checkbox) {
            checkbox.checked = it.isComplete;
        }
    });
};
var toggleComplete = function (id) {
    var taskToUpdate = taskInputList.find(function (it) { return it.id === id; });
    if (taskToUpdate) {
        taskToUpdate.isComplete = !taskToUpdate.isComplete;
        var allChecked = taskInputList.every(function (it) { return it.isComplete; });
        if (totaltaskBtn) {
            totaltaskBtn.checked = allChecked;
        }
    }
};
taskInputBtn.addEventListener("click", taskInputAddBtn);
totaltaskBtn.addEventListener("click", totalCheckBtn);
//추가버튼
function taskInputAddBtn() {
    taskInputList.forEach(function (task) {
        task.isComplete = false;
    });
    var taskContent = taskInput.value;
    var randomId = generalRandomId();
    var newTask = { id: randomId, content: taskContent, isComplete: false };
    taskInputList.push(newTask);
    render();
}
//render
var render = function () {
    var resultHTML = "";
    var allChecked = taskInputList.every(function (it) { return it.isComplete; });
    if (totaltaskBtn) {
        totaltaskBtn.checked = allChecked;
    }
    for (var i = 0; i < taskInputList.length; i++) {
        resultHTML += "<div class=\"task-items\">\n  <div class=\"checkicon-box\">\n    <label for=\"".concat(taskInputList[i].id, "\" >\n      <input\n        type=\"checkbox\"\n        id=").concat(taskInputList[i].id, "\n        name=\"checkboxGroup\"\n        class=\"checkicon\"\n        onClick =\"toggleComplete('").concat(taskInputList[i].id, "')\"\n    /></label>\n  </div>\n  <div class=\"task\">\n    <div id=\"readonly-").concat(taskInputList[i].id, "\">").concat(taskInputList[i].content, "</div>\n    <label for=\"edit-").concat(taskInputList[i].id, "\">\n    <input id=\"edit-").concat(taskInputList[i].id, "\" type=\"text\" value=\"").concat(taskInputList[i].content, "\"/></label>\n  </div>\n  <div class=\"update\">\n    <button id=\"edit-Btn-").concat(taskInputList[i].id, "\" onclick=\"toggleEditBtn('").concat(taskInputList[i].id, "')\">\uC218\uC815</button>\n    <button id=\"editComplete-Btn-").concat(taskInputList[i].id, "\" style=\"display:none\" onclick=editcomplete('").concat(taskInputList[i].id, "')>\uC218\uC815\uC644\uB8CC</button>\n  </div>\n  <div class=\"delete\">\n    <button id=delete-Btn-").concat(taskInputList[i].id, " onclick=\"singlePostDelete('").concat(taskInputList[i].id, "')\">\uC0AD\uC81C</button>\n    <button id=\"editCancel-Btn-").concat(taskInputList[i].id, "\" style=\"display:none\" onclick=editCancel('").concat(taskInputList[i].id, "')>\uC218\uC815\uCDE8\uC18C</button>\n  </div>\n</div>");
    }
    document.querySelector(".task-items-box").innerHTML = resultHTML;
};
//랜덤ID생성
var generalRandomId = function () {
    return "_" + Math.random().toString(36).substr(2, 9);
};
/**
 * 단일 삭제
 */
function singlePostDelete(id) {
    var newTaskInputList = taskInputList.filter(function (it) {
        return it.id !== id;
    });
    taskInputList = newTaskInputList;
    render();
    //전체체크 업데이트
    if (totaltaskBtn) {
        totaltaskBtn.checked = false;
    }
}
/**
 * 선택 삭제
 * 1. 선택된 아이템(id)들을 전부 배열로 받아둔다
 *    => 전체 리스트에서 반복문을 통해 새로운 배열을 생성
 *    => 조건은 isComplete = true 인 Id값만 가져오기
 * 2. 해당 배열을 제외한 나머지 id값들로 list를 새롭게 재선언한다
 * 3. 새롭게 선언한것으로 render한다
 */
function handleMultiDelete() {
    var confirm = window.confirm("선택된 항목을 삭제하시겠습니까?");
    if (confirm) {
        selectedIds = taskInputList
            .filter(function (it) { return it.isComplete; })
            .map(function (it) { return it.id; });
        var selectedItems = selectedIds.length > 0;
        if (!selectedItems) {
            alert("선택된 항목이 없습니다.");
            return;
        }
        var updatedTaskInputList = taskInputList.filter(function (it) { return !selectedIds.includes(it.id); });
        taskInputList = updatedTaskInputList;
        render();
        //전체체크 업데이트
        if (totaltaskBtn) {
            totaltaskBtn.checked = false;
        }
    }
}
/**
 * 전체 삭제
 */
function totalDelete() {
    if (taskInputList.length <= 0) {
        alert("삭제할 항목이 없습니다.");
        return;
    }
    var confirmed = window.confirm("정말 다 삭제하시겠습니까?");
    if (confirmed) {
        taskInputList = [];
        render();
        //전체체크 업데이트
        if (totaltaskBtn) {
            totaltaskBtn.checked = false;
        }
    }
}
/**
 * 수정버튼
 * taskInputList[i].content 부분을 edit input type="text" 로 전환
 *
 */
function toggleEditBtn(id) {
    //text
    var readonlyInputStyle = document.getElementById("readonly-".concat(id));
    /**
     * 직접적으로 숨겨야 하는 Id와 display:flex를 적용시켜야 하는 input이 아닌 label을 가져와서 flex를 적용
     * [] 속성 선택자
     */
    var editLabel = document.querySelector("label[for=\"edit-".concat(id, "\"]"));
    readonlyInputStyle.style.display = "none";
    editLabel.style.display = "flex";
    var editBtn = document.getElementById("edit-Btn-".concat(id));
    var editCompleteBtn = document.getElementById("editComplete-Btn-".concat(id));
    //수정완료 버튼
    editBtn.style.display = "none";
    editCompleteBtn.style.display = "block";
    var editCancelBtn = document.getElementById("editCancel-Btn-".concat(id));
    var deleteBtn = document.getElementById("delete-Btn-".concat(id));
    //수정취소 버튼
    deleteBtn.style.display = "none";
    editCancelBtn.style.display = "block";
    /**
     * 수정버튼 클릭시 input에 value 값으로 현재 Id.content 표시
     * 수정완료버튼 시 객체 content 를 업그레이드 render
     * 수정취소 시 객체 content 를 기존 그대로 render
     */
}
//수정완료버튼
function editcomplete(id) {
    var readonlyInputStyle = document.getElementById("readonly-".concat(id));
    var editLabel = document.querySelector("label[for=\"edit-".concat(id, "\"]"));
    var editBtn = document.getElementById("edit-Btn-".concat(id));
    var editCompleteBtn = document.getElementById("editComplete-Btn-".concat(id));
    var editCancelBtn = document.getElementById("editCancel-Btn-".concat(id));
    var deleteBtn = document.getElementById("delete-Btn-".concat(id));
    var task = document.getElementById("edit-".concat(id));
    var updatedValue = task.value;
    var taskUpdate = taskInputList.find(function (it) { return it.id === id; });
    if (taskUpdate) {
        taskUpdate.content = updatedValue;
    }
    //input 초기화
    readonlyInputStyle.style.display = "flex";
    editLabel.style.display = "none";
    //버튼초기화
    editBtn.style.display = "block";
    editCompleteBtn.style.display = "none";
    editCancelBtn.style.display = "none";
    deleteBtn.style.display = "block";
    render();
}
//수정취소버튼
function editCancel(id) {
    var readonlyInputStyle = document.getElementById("readonly-".concat(id));
    var editLabel = document.querySelector("label[for=\"edit-".concat(id, "\"]"));
    var editBtn = document.getElementById("edit-Btn-".concat(id));
    var editCompleteBtn = document.getElementById("editComplete-Btn-".concat(id));
    var editCancelBtn = document.getElementById("editCancel-Btn-".concat(id));
    var deleteBtn = document.getElementById("delete-Btn-".concat(id));
    render();
    //input 초기화
    readonlyInputStyle.style.display = "flex";
    editLabel.style.display = "none";
    //버튼초기화
    editBtn.style.display = "block";
    editCompleteBtn.style.display = "none";
    editCancelBtn.style.display = "none";
    deleteBtn.style.display = "block";
}
