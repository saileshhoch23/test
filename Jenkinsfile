pipeline {
    agent any
    stage('Checkout') {
        when {
            allOf {
                not { changeset pattern: "Jenkinsfile" }
                branch 'main'
            }    
        }
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
