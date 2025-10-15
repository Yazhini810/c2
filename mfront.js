<!--
HOW TO RUN THIS APPLICATION:

1️⃣ Create a folder (e.g., student-app) and save this file as index.html
2️⃣ In the same folder, create server.js with the backend code below.
3️⃣ Install dependencies:
      npm init -y
      npm install express cors body-parser mongoose
4️⃣ Start MongoDB in a new terminal:
      mongod
5️⃣ Run the server:
      node server.js
6️⃣ Open browser:
      http://localhost:4000
-->

<!DOCTYPE html>
<html ng-app="studentApp">
  <head>
    <meta charset="UTF-8" />
    <title>Student Dashboard</title>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>
  </head>

  <body ng-controller="MainCtrl">
    <h2>Add Student</h2>
    <form ng-submit="addStudent()">
      Name: <input type="text" ng-model="newStudent.name" required>
      Age: <input type="number" ng-model="newStudent.age" required>
      <button type="submit">add</button>
    </form>

    <div>
      <h2>Student List</h2>
      <div ng-repeat="s in students">
        <p>{{s.name}} - {{s.age}} years old</p>
        <button ng-click="editStudent(s)">edit</button>
        <button ng-click="deleteStudent(s._id)">delete</button>
      </div>
      <p ng-if="students.length === 0">No students yet. Add one above!</p>
    </div>

    <script>
      // ============ app.js ============
      var app = angular.module('studentApp', []);

      app.service('studentService', function($http) {
          var baseUrl = "http://localhost:4000/api/students";

          this.getAll = function() {
              return $http.get(baseUrl);
          };
          this.add = function(s) {
              return $http.post(baseUrl, s);
          };
          this.update = function(id, s) {
              return $http.put(baseUrl + "/" + id, s);
          };
          this.delete = function(id) {
              return $http.delete(baseUrl + "/" + id);
          };
      });

      // ============ controller.js ============
      app.controller('MainCtrl', function($scope, studentService) {
          $scope.students = [];
          $scope.newStudent = {};

          function load() {
              studentService.getAll().then(function(res) {
                  $scope.students = res.data;
              }).catch(function(error) {
                  console.error('Error loading students:', error);
              });
          }

          $scope.addStudent = function() {
              studentService.add($scope.newStudent).then(function(res) {
                  $scope.students.push(res.data);
                  $scope.newStudent = {};
              }).catch(function(error) {
                  console.error('Error adding student:', error);
              });
          };

          $scope.editStudent = function(s) {
              var name = prompt("Enter new name:", s.name);
              if (name === null) return;

              var age = prompt("Enter new age:", s.age);
              if (age === null) return;

              if (name && age) {
                  var ageNum = parseInt(age);
                  if (ageNum > 0 && ageNum < 150) {
                      studentService.update(s._id, { name: name, age: ageNum }).then(function(res) {
                          var index = $scope.students.findIndex(function(student) {
                              return student._id === s._id;
                          });
                          if (index !== -1) {
                              $scope.students[index].name = res.data.name;
                              $scope.students[index].age = res.data.age;
                          }
                      }).catch(function(error) {
                          console.error('Error updating student:', error);
                          alert('Failed to update student. Check console for details.');
                      });
                  } else {
                      alert('Please enter a valid age (1-149)');
                  }
              } else {
                  alert('Name and age are required');
              }
          };

          $scope.deleteStudent = function(id) {
              if (confirm('Are you sure you want to delete this student?')) {
                  studentService.delete(id).then(function() {
                      $scope.students = $scope.students.filter(function(s) {
                          return s._id !== id;
                      });
                  }).catch(function(error) {
                      console.error('Error deleting student:', error);
                      alert('Failed to delete student');
                  });
              }
          };

          load();
      });
    </script>
  </body>
</html>
<!DOCTYPE html>
<html ng-app="studentApp">
  <head>
    <meta charset="UTF-8" />
    <title>Student Dashboard</title>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>
    <style>
      body {
        background-color: #f0f8ff; /* light blue background */
      }
    </style>
  </head>

  <body ng-controller="MainCtrl">
    <h2>Add Student</h2>
    <form ng-submit="addStudent()">
      Name: <input type="text" ng-model="newStudent.name" required>
      Age: <input type="number" ng-model="newStudent.age" required>
      <button type="submit">add</button>
    </form>

    <div>
      <h2>Student List</h2>
      <div ng-repeat="s in students">
        <p>{{s.name}} - {{s.age}} years old</p>
        <button ng-click="editStudent(s)">edit</button>
        <button ng-click="deleteStudent(s._id)">delete</button>
      </div>
      <p ng-if="students.length === 0">No students yet. Add one above!</p>
    </div>

    <script>
      var app = angular.module('studentApp', []);

      app.service('studentService', function($http) {
          var baseUrl = "http://localhost:4000/api/students";
          this.getAll = function() { return $http.get(baseUrl); };
          this.add = function(s) { return $http.post(baseUrl, s); };
          this.update = function(id, s) { return $http.put(baseUrl + "/" + id, s); };
          this.delete = function(id) { return $http.delete(baseUrl + "/" + id); };
      });

      app.controller('MainCtrl', function($scope, studentService) {
          $scope.students = [];
          $scope.newStudent = {};

          function load() {
              studentService.getAll().then(function(res) {
                  $scope.students = res.data;
              });
          }

          $scope.addStudent = function() {
              studentService.add($scope.newStudent).then(function(res) {
                  $scope.students.push(res.data);
                  $scope.newStudent = {};
              });
          };

          $scope.editStudent = function(s) {
              var name = prompt("Enter new name:", s.name);
              if (name === null) return;
              var age = prompt("Enter new age:", s.age);
              if (age === null) return;
              var ageNum = parseInt(age);
              if(name && ageNum>0 && ageNum<150){
                  studentService.update(s._id, {name:name, age:ageNum}).then(function(res){
                      var index = $scope.students.findIndex(function(st){ return st._id===s._id; });
                      if(index!==-1){ $scope.students[index] = res.data; }
                  });
              }
          };

          $scope.deleteStudent = function(id) {
              if(confirm('Are you sure?')){
                  studentService.delete(id).then(function() {
                      $scope.students = $scope.students.filter(s => s._id!==id);
                  });
              }
          };

          load();
      });
    </script>
  </body>
</html>

