pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                dir('/var/www/html/test/') {
                    echo 'Building..'
                    sh 'cd /var/www/html/test'
                    sh 'npm install --force' 
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                dir('/var/www/html/test/') {
                    sh 'cd /var/www/html/test'
                    sh ' pm2 stop test-app'
                    sh ' pm2 delete test-app'
                    sh 'pm2 start npm --name "test-app" -- start' 
                    echo 'Deploying....'
                }
            }
        }
    }
 
}
