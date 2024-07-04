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
  environment {
      
        EMAIL_TO = 'saileshhoch23@gmail.com'
    }  
post {
        failure {
            emailext body: 'Check console output at $BUILD_URL to view the results. \n\n ${CHANGES} \n\n -------------------------------------------------- \n${BUILD_LOG, maxLines=100, escapeHtml=false}', 
                    to: "${EMAIL_TO}", 
                    subject: 'Build failed in Jenkins: $PROJECT_NAME - #$BUILD_NUMBER'
        }
        unstable {
            emailext body: 'Check console output at $BUILD_URL to view the results. \n\n ${CHANGES} \n\n -------------------------------------------------- \n${BUILD_LOG, maxLines=100, escapeHtml=false}', 
                    to: "${EMAIL_TO}", 
                    subject: 'Unstable build in Jenkins: $PROJECT_NAME - #$BUILD_NUMBER'
        }
        changed {
            emailext body: 'Check console output at $BUILD_URL to view the results.', 
                    to: "${EMAIL_TO}", 
                    subject: 'Jenkins build is back to normal: $PROJECT_NAME - #$BUILD_NUMBER'
        }
        success {
                emailext body: 'Check console output at $BUILD_URL to view the results.', 
                    to: "${EMAIL_TO}", 
                    subject: 'Jenkins success : $PROJECT_NAME - #$BUILD_NUMBER'
        
        }
    }
 
}
