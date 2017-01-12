/**
 * Created by erick paquin et Michael Gabriel on 21/11/16.
 *
 * Client-side code.
 **/

var TheTable = "";

var BandColName = [];
var BandColNum = 0;
var CityColName = [];
var CityColNum = 0;
var FinancesColName = [];
var FinancesColNum = 0;
var ColName = [];
var ColNum = 0;

function load(ButtonId)
{
    TheTable = ButtonId;

    var request = new XMLHttpRequest();

    request.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var TableHeader = document.getElementById("tableheader");
            var TableBody = document.getElementById("tablebody");
            var CaptureData = JSON.parse(this.responseText);
            var RowNum = CaptureData.length;


            if (CaptureData[0])
            {
                if (!TheTable.localeCompare("band"))
                {
                    BandColName = Object.keys(CaptureData[0]);
                    BandColNum = Object.keys(CaptureData[0]).length;
                }
                if (!TheTable.localeCompare("city"))
                {
                    CityColName = Object.keys(CaptureData[0]);
                    CityColNum = Object.keys(CaptureData[0]).length;
                }
                if (!TheTable.localeCompare("finances"))
                {
                    FinancesColName = Object.keys(CaptureData[0]);
                    FinancesColNum = Object.keys(CaptureData[0]).length;
                }
                if (!TheTable.localeCompare("band"))
                {
                    ColName = BandColName.slice(0);
                    ColNum = 3;
                }
                if (!TheTable.localeCompare("city"))
                {
                    ColName = CityColName.slice(0);
                    ColNum = 3;
                }
                if (!TheTable.localeCompare("finances"))
                {
                    ColName = FinancesColName.slice(0);
                    ColNum = 5;
                }
            }

            var InnerForHeader = "";
            var InnerForInsert = "";

            for (var i = 0; i < ColNum; i++)
            {
                InnerForHeader += '<div class="col">' + ColName[i] + '</div>';
                if (i == 0)
                {
                    InnerForInsert += '<div class="col hide"><input type="text"></div>';
                }
                else
                {
                    InnerForInsert += '<div class="col"><input type="text"></div>';
                }
            }
            TableHeader.innerHTML = '<h2>' + 'Table ' + ButtonId + '</h2>';
            TableHeader.innerHTML += '<div class="row">' + InnerForHeader + '<div class="col">Action</div></div>';
            TableHeader.innerHTML += '<div class="row">' + InnerForInsert + '<div class="col"><button onclick="validateit(this.parentNode.parentNode);">Insert</button></div>';

            if (RowNum > 0)
            {
                TableBody.innerHTML = "";

                for (var j = 0; j < RowNum; j++)
                {
                    var RowData = CaptureData[j];
                    var Col = Object.keys(RowData);
                    var InnerForBody = '<div class="row line">';
                    var InnerForData = "";

                    for (var k = 0; k < ColNum; k++)
                    {
                        var ColData = RowData[Col[k]];
                        if (k == 0)
                        {
                            InnerForData += '<div class="col">' + ColData + '</div>';
                        }
                        else
                        {
                            InnerForData += '<div class="col" contenteditable="true">' + ColData + '</div>';
                        }
                    }
                    InnerForBody += InnerForData + '<div class="col"><button class="modify" onclick="modify(this.parentNode.parentNode)">Update</button>' +
                        '<button class="delete" onclick="remove(this.parentNode.parentNode)">Delete</button></div></div>';
                    TableBody.innerHTML += InnerForBody;
                }
            }
            else
            {
                var InnerForHeader = "";
                var InnerForInsert = "";

                if (!TheTable.localeCompare("band"))
                {
                    ColName = BandColName.slice(0);
                    ColNum = 3;
                }
                if (!TheTable.localeCompare("city"))
                {
                    ColName = CityColName.slice(0);
                    ColNum = 3;
                }
                if (!TheTable.localeCompare("finances"))
                {
                    ColName = FinancesColName.slice(0);
                    ColNum = 5;
                }

                for (var l = 0; l < ColNum; l++)
                {
                    InnerForHeader += '<div class="col">' + ColName[l] + '</div>';
                    InnerForInsert += '<div class="col"><input type="text"></div>';
                }
                TableHeader.innerHTML = '<h2>' + 'Table ' + ButtonId + '</h2>';
                TableHeader.innerHTML += '<div class="row">' + InnerForHeader + '<div class="col">Action</div></div>';
                TableHeader.innerHTML += '<div class="row">' + InnerForInsert + '<div class="col"><button onclick="validateit(this.parentNode.parentNode);">Insert</button></div>';

                TableBody.innerHTML = "No More Entries, Please Enter More";
            }
        }
        if (this.readyState == 4 && this.status == 404)
        {
            console.log(404);
        }
    };
    request.open("GET", ButtonId, true);
    request.send();
    return false;
}


function modify(Row)
{
    var Id = Row.firstChild.innerHTML;
    var RowData = [];
    for (var i = 0; i < Row.childElementCount - 1; i++)
    {
        RowData.push(Row.children[i].innerHTML);
    }

    var request = new XMLHttpRequest();
    request.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            load(request.responseText);
            console.log(request.responseText);
        }
        if (this.readyState == 4 && this.status == 404)
        {
            console.log(404);
        }
    };

    var a =
        {
            TableName : TheTable,
            TheId : Id,
            TheInfo : RowData
        };

    request.open("PUT", JSON.stringify(a), true);
    request.send();
    return false;

}

function remove(Row)
{
    var Id = Row.firstChild.innerHTML;
    var RowData = [];

    for (var i = 0; i < Row.childElementCount - 1; i++)

    {
        RowData.push(Row.children[i].innerHTML);
    }

    var request = new XMLHttpRequest();
    request.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            load(request.responseText);
            console.log(request.responseText);
        }
        if (this.readyState == 4 && this.status == 404)
        {
            console.log(404);
        }
    };

    var a =
        {
            TableName : TheTable,
            TheId : Id,
            TheInfo : RowData
        };

    request.open("DELETE", JSON.stringify(a), true);
    request.send();
    return false;
}

function addvalues(Row)
{
    var RowData = [];
    for (var i = 0; i < Row.childElementCount - 1; i++)

    {
        RowData.push(Row.children[i].firstChild.value);
    }

    var request = new XMLHttpRequest();

    request.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            load(request.responseText);
            console.log(request.responseText);
        }
        if (this.readyState == 4 && this.status == 404)
        {
            console.log(404);
        }
    };

    var a = {
        TableName : TheTable,
        TheInfo : RowData
    };

    request.open("POST", JSON.stringify(a), true);
    request.send();
    return false;
}

function validateit(Row){
    var bad = "";
    for (var i = 0; i < Row.childElementCount - 1; i++)

    {
        if(Row.children[i].firstChild.value == ""){
            bad = "yes";

        }

    }

    if(bad="yes"){
        alert("Vous devez remplir tout les champs!");
        return false;
    }else{
        addvalues(Row);
    }

}