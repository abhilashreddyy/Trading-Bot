function getIncDecObj(i, mark, currTrend ,myList){
    return {
        "st" : i,
        "en" : mark,
        "len" : mark-i+1,
        "trend" : currTrend,
        "elements" : myList.slice(i,mark+1)
    }
    
}

function increasingDecreasingSequence(myList){
    let mark = 0
    let i = 0
    let incDecList = []
    let currTrend = 1
    while(mark < myList.length-1){
        if(mark == i){
            mark+=1
            if(myList[i] <= myList[mark]){
                currTrend = 1
            }
            else{
                currTrend = -1
            }
        }
        else if(myList[mark] <= myList[mark+1] && currTrend == -1){
            incDecList.push(getIncDecObj(i, mark, currTrend, myList))
            i = mark
            mark+=1
            currTrend = 1
        }
        else if(myList[mark] > myList[mark+1] && currTrend == 1){
            incDecList.push(getIncDecObj(i, mark, currTrend, myList))
            i = mark
            mark+=1
            currTrend = -1
        }
        else{
            mark+=1
        }
    }
    incDecList.push(getIncDecObj(i, mark, currTrend, myList))

    return incDecList
    

}

// console.log(increasingDecreasingSequence([1,2,3,2,1,2,3,4,5,6,6,7,8,4,3,2,2,1]))