/* 
Infragistics UltraWebGrid Script 
Version 3.1.20042.26
Copyright (c) 2001-2004 Infragistics, Inc. All Rights Reserved.
*/

function igtbl_sortGrid()
{
	this.Rows.sort();
}

function igtbl_columnCompareRows(row1,row2)
{
	if(!row1.GroupByRow || !row2.GroupByRow)
		return;
	var res=0;
	var v1=row1.Value;
	var v2=row2.Value;
	switch(this.DataType)
	{
		default:
			if(v1==null && v2!=null)
				res=-1;
			else if(v1!=null && v2==null)
				res=1;
			else if(v1<v2)
				res=-1;
			else if(v1>v2)
				res=1;
	}
	if(this.SortIndicator==2)
		res=-res;
	return res;
}

function igtbl_columnCompareCells(cell1,cell2)
{
	var res=0;
	var v1=cell1.getValue(this.Type==5 || this.WebComboId);
	var v2=cell2.getValue(this.Type==5 || this.WebComboId);
	if(!cell1.Band.Grid.CaseSensitiveSort)
	{
		if(typeof(v1)=="string")
			v1=v1.toLowerCase();
		if(typeof(v2)=="string")
			v2=v2.toLowerCase();
	}
	switch(this.DataType)
	{
		default:
			if(v1==null && v2!=null)
				res=-1;
			else if(v1!=null && v2==null)
				res=1;
			else if(v1<v2)
				res=-1;
			else if(v1>v2)
				res=1;
	}
	if(this.SortIndicator==2)
		res=-res;
	return res;
}

function igtbl_quickSort(cln,array,left,right)
{
	var i,j,comp,temp;
	i=left;
	j=right;
	comp=cln.getRow(array[Math.floor((left+right)/2)]);
	do
	{
		while(cln.getRow(array[i]).compare(comp)<0 && i<right)
			i++;
		while(cln.getRow(array[j]).compare(comp)>0 && j>left)
			j--;
		if(i<=j)
		{
			temp=array[i];
			array[i]=array[j];
			array[j]=temp;
			i++;
			j--;
		} 
	}
	while(i<=j);
	if(left<j)
		igtbl_quickSort(cln,array,left,j);
	if(i<right)
		igtbl_quickSort(cln,array,i,right); 
}

function igtbl_clctnSort(sortedCols)
{
	if(!sortedCols)
		sortedCols=this.Band.SortedColumns;
	this.setLastRowId();
	var changed=true;
	var sortArray=new Array(this.length);
	var chkBoxArray=new Array();
	for(var i=0;i<this.length;i++)
		sortArray[i]=i;
	for(i=0;i<this.Band.Columns.length;i++)
	{
		if(this.Band.Columns[i].Type==3)
			chkBoxArray[chkBoxArray.length]=i;
	}
	if(sortedCols.length>0 && this.length>0)
		igtbl_quickSort(this,sortArray,0,this.length-1);
	var cntnSort=false;
	for(var i=this.Band.Index+1;i<this.Grid.Bands.length && !cntnSort;i++)
		if(this.Grid.Bands[i].SortedColumns.length>0)
			cntnSort=true;
	for(var i=0;i<this.length;i++)
	{
		if(sortArray[i]!=i)
		{
			var san=sortArray[i];
			this.insert(this.remove(san),i);
			igtbl_dontHandleChkBoxChange=true;
			for(var j=0;j<chkBoxArray.length;j++)
			{
				var cell=this.getRow(i).getCell(chkBoxArray[j]);
				if(cell.Element.getAttribute("chkBoxState"))
				{
					var chkBoxEl=cell.Element.firstChild;
					if(chkBoxEl.tagName=="NOBR")
						chkBoxEl=chkBoxEl.firstChild;
					chkBoxEl.checked=(cell.Element.getAttribute("chkBoxState")=="true");
				}
			}
			igtbl_dontHandleChkBoxChange=false;
			sortArray[i]=i;
			for(j=i+1;j<sortArray.length;j++)
				if(sortArray[j]<san)
					sortArray[j]++;
		}
		var curRow=this.getRow(i);
		var className="";
		if(curRow.Band.getRowAltClassName()!="")
		{
			if(i%2)
				className=curRow.Band.getRowAltClassName();
			else
				className=curRow.Band.getRowStyleClassName();
		}
		if(className && !curRow.GroupByRow)
		{
			for(var j=0;j<curRow.cells.length;j++)
			{
				var cell=curRow.getCell(j);
				cell.Element.className=className+(cell.Column.CssClass?" "+cell.Column.CssClass:"");
			}
		}
		if(curRow.Expandable)
		{
			var col=sortedCols.length>0?igtbl_getColumnById(sortedCols[0]):null;
			if(col && col.IsGroupBy)
			{
				if(curRow.Rows)
					curRow.Rows.sort(sortedCols.slice(1));
			}
			else if(cntnSort && curRow.Rows)
				curRow.Rows.sort(this.Grid.Bands[this.Band.Index+1].SortedColumns);
		}
	}
	igtbl_dispose(sortArray);
	delete sortArray;
	igtbl_dispose(chkBoxArray);
	delete chkBoxArray;
}

