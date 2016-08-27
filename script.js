function getData() {
    $.ajax({
        url: "http://hn.algolia.com/api/v1/search_by_date?tags=story",
        dataType: 'json',
        success: function(results) {
            document.getElementById("main").innerHTML = "";
            console.log(results);
            var flag = 1;
            for (i = 0; i < 20; i++) {
                listItem = document.createElement("LI");
                var linkItem = document.createElement("a");
                var itemNumber = document.createElement("p");
                var itemNumberText = document.createTextNode(i + 1);
                itemNumber.appendChild(itemNumberText);
                listItem.appendChild(itemNumber);
                var linkText = document.createTextNode(". " + results.hits[i].title);
                linkItem.setAttribute('href', results.hits[i].url);
                linkItem.setAttribute('target', "_blank");
                linkItem.appendChild(linkText);
                listItem.appendChild(linkItem);

                // *******************logic to calculate time of new post************************

                var postTime = new Date(results.hits[i].created_at).getTime();
                var presentTime = new Date().getTime();
                var msDiff = presentTime - postTime; //in ms
                var minDiff = msDiff / 60 / 1000; //in minutes

                if (minDiff >= 60) {
                    var postTimeHours = minDiff / 60 + " hours ";
                    var postTimeMins = Math.floor(minDiff % 60) + " minutes";
                    timePosted = postTimeHours + postTimeMins;
                } else {
                    timePosted = Math.ceil(minDiff) - 1 + " mins";
                    if (timePosted < 0) {
                        timePosted = 0;
                    }
                }

                // *************************END*********************************************

                var postedBefore = document.createElement("span");
                var postedBeforeTime = document.createTextNode("  Posted: " + timePosted + " ago");
                postedBefore.appendChild(postedBeforeTime);
                listItem.appendChild(postedBefore);

                document.getElementById("main").appendChild(listItem);

                if (check > 0) {

                    getObjectId = (results.hits[i].objectID);

                    if (getObjectId > timeStamp) {
                        keepState.unshift(1);
                    }
                    console.log(keepState[i]);
                    if (getObjectId > timeStamp || keepState[i] > 0) {
                        getListItem = $("ul li:nth-child(" + flag + ")");
                        getListItem.addClass('newFeed');
                        console.log("yoww");
                        keepState[i] = 1;
                    }
                    flag++;
                }
            }
            check++;
            timeStamp = (results.hits[0].objectID);
            $("#main li.newFeed").click(function() {
                keepState[Number(($($(this)[0].getElementsByTagName("p")[0]).text()) - 1)] = 0;
                $(this).removeClass('newFeed');
            });
        }
    });
};

$(document).ready(function() {
    keepState = new Array(20).fill(0); // keeping state to prevent refresh of unread links bg color;
    getData();
    timeStamp = 12337452;
    check = 0;
});

setInterval(function() {
    getData();
    console.log("i am refreshed");
}, 7000);
