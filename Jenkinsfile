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
        stage('Stop') {
            steps {
                dir('/var/www/html/test/') {
                    sh 'cd /var/www/html/test'
                    echo 'stop..'
                }
            }
        }
        stage('Deploy') {
            steps {
                dir('/var/www/html/test/') {
                    sh 'cd /var/www/html/test/'
                    sh 'npm start' 
                    echo 'Deploying....'
                }
            }
        }
    }
 
}
