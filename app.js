angular.module('studentGradeApp', [])
    .controller('GradeController', function(GradeService) {
        var ctrl = this;

        // Initialize the grades object
        ctrl.grades = {
            name: '',
            math: 0,
            science: 0,
            english: 0,
            history: 0,
            geography: 0
        };

        // Initialize total percentage and students list
        ctrl.totalPercentage = 0;
        ctrl.students = [];
        ctrl.topper = null;

        // Function to submit grades
        ctrl.submitGrades = function() {
            // Calculate total percentage
            var total = ctrl.grades.math + ctrl.grades.science + ctrl.grades.english + ctrl.grades.history + ctrl.grades.geography;
            ctrl.totalPercentage = (total / 500) * 100;  // Assuming 100 marks for each subject

            // Submit grades to the backend (Node.js)
            GradeService.submitGrades(ctrl.grades).then(function(response) {
                console.log('Grades submitted:', response.data);
                ctrl.getGrades();  // Refresh the list of students
            }, function(error) {
                console.error('Error submitting grades:', error);
            });
        };

        // Function to get all students and topper
        ctrl.getGrades = function() {
            GradeService.getGrades().then(function(response) {
                ctrl.students = response.data.students;
                ctrl.topper = response.data.topper;
            }, function(error) {
                console.error('Error fetching grades:', error);
            });
        };

        // Fetch grades on page load
        ctrl.getGrades();
    })
    .service('GradeService', function($http) {
        this.submitGrades = function(grades) {
            return $http.post('http://localhost:3000/grades', grades);
        };

        this.getGrades = function() {
            return $http.get('http://localhost:3000/grades');
        };
    });
