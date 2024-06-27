pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm install --force' 
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
                sh 'pm2 start npm --name "test-app" -- start' 
                echo 'Deploying....'
            }
        }
    }
 
}
