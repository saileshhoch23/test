pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'cd /var/www/html/test'
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
                sh 'cd /var/www/html/test'
                sh 'pm2 start npm --name "test-app" -- start' 
                echo 'Deploying....'
            }
        }
    }
 
}
