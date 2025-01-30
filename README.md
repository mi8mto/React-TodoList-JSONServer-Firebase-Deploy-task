deploy github: https://mi8mto.github.io/React-TodoList-JSONServer-Firebase-Deploy-task/

deploy firebase: https://todolistdeploy.web.app/

firebase deploy

1. change database
2. change url
3. npm i

deploy github

1. init (по списку GitHub )
2. git init
3. git add .
4. git remote add origin "НАШ РЕПОЗИТОРИЙ"
5. git push -u origin "НАША ВЕТКА"

npm install gh-pages --save-dev
в package.json в scripts после "dev" add "predeploy": "npm run build", "deploy": "gh-pages -d dist",
в vite.config add base: '/папку и именем GitHub',
git add .
git commit -m "comment"
git push
npm run deploy
settings gh-pages
