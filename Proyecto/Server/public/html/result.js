module.exports.topFive = (title, names, data)=>(`
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Moody Results</title>
    <link rel="stylesheet" type="text/css" href="/css/result.css"></link>

  </head>
  <body>
    <div class="container">
      <canvas id="myChart"/>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.bundle.js"></script>
    <script>
      var ctx = document.getElementById("myChart");
      var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: [${names.toString()}],
              datasets: [{
                  label: "${title}",
                  data: [${data.toString()}],
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
              }
          }
      });
    </script>
  </body>
</html>
`)

module.exports.timeline = (dates, data, user)=>(`
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Moody Results</title>
    <link rel="stylesheet" type="text/css" href="/css/result.css"></link>

  </head>
  <body>
    <div class="container">
      <canvas id="myChart"/>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.bundle.js"></script>
    <script>
      var ctx = document.getElementById("myChart");
      var myChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: [${dates.toString()}],
              datasets: [${data.toString()}]


          },
          options: {
            title: {
              display: true,
              text: 'Sentiment Timeline for user ${user}'
            }
          }
      });
    </script>
  </body>
</html>
`)
