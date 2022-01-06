
/*
x[i] is binary, it means 1 or 0
v[i] is coefficient of x[i], it's same as sum of two scores (atk, def)
a[i] is same as of score atk
d[i] is same as of scroe def
min sigma(v[i]*x[i])
1. row : sigma(v[i]*x[i]) >= 0.5 * sigma(v[i]) 
2. row : sigma(x[i]) = n/2 or (TODO : >= (n-1)/2 , <= (n+1)/2) 
3. row : 0.47 * sigma(a[i]) <= sigma(x[i]*a[i]) <= 0.53 * sigma(a[i])
4. row : 0.47* sigma(d[i]) <= sigma(x[i]*d[i]) <= 0.53 * sigma(d[i])
*/

const glpk = require('glpk.js');

module.exports = {
    glpk2 : async function(playerInfo){

    const list = playerInfo
    var resultGLPK = []
    var resultModule = {}
    const numOfPlayers = list.length
    var percent = 0.5
    var max = 0.52
    var min = 0.48


    var sum = 0
    var sumatk = 0
    var sumdef = 0
    
    /**
     * MIP Problem modelling object
     * Finding minimum, 4 rows, vars mean variables, all variables are binaries  
     */
    let mip = {
        name: 'MIP',
        objective: { direction: glpk.GLP_MAX, name: 'obj', vars: [] },
        subjectTo: [
            { name: 'row1', vars: [] },
            { name: 'row2', vars: [] },
            { name: 'row3', vars: [] },
            { name: 'row4', vars: [] }
        ],
        binaries: []
    }

    var rownumber = 5;

    // It's for adding variables with loop because variables are dynamic
    for(var i = 0 ; i < numOfPlayers ; i++){

        var player = list[i]

        mip.objective.vars.push({ name: 'x'+i, coef: player.total})
        mip.subjectTo[0].vars.push({ name: 'x'+i, coef: player.total})
        mip.subjectTo[1].vars.push({ name: 'x'+i, coef: 1})
        mip.subjectTo[2].vars.push({ name: 'x'+i, coef: player.def})
        mip.subjectTo[3].vars.push({ name: 'x'+i, coef: player.atk})
        
        mip.binaries.push('x'+i)

        sum += player.total
        sumatk += player.atk
        sumdef += player.def

    }

    
    mip.subjectTo[0].bnds = { type: glpk.GLP_DB, ub: sum * 0.5 , lb: sum * min }
    mip.subjectTo[2].bnds = { type: glpk.GLP_DB, ub: sumdef * max , lb: sumdef * min }
    mip.subjectTo[3].bnds = { type: glpk.GLP_DB, ub: sumatk * max , lb: sumatk * min }

    // Setting for even number or odd number of players
    if(list.length%2 != 0){
        mip.subjectTo[1].bnds = { type: glpk.GLP_FX, ub: list.length/2-1/2, lb: list.length/2-1/2}
        numOfMembers = list.length/2 -1/2
    }
    else{
        mip.subjectTo[1].bnds = { type: glpk.GLP_FX, ub: list.length/2, lb: list.length/2}
        numOfMembers = list.length/2 - 1/2
    }
    
    // Iterative methods to find various results
    while(resultGLPK.length < 10){
        
       
        var solver = await glpk.solve(mip, glpk.GPL_MSG_ALL)
        
        //////////////////////////////
        
        if(solver.result.status != 4){
            mip.subjectTo.push({name: 'row'+rownumber, vars:[], bnds:{type: glpk.GLP_UP, ub: numOfMembers-1 , lb: 0.0}})
            
            for(var k=0 ; k < numOfPlayers ; k++){

                mip.subjectTo[rownumber-1].vars.push({ name: 'x'+k, coef: solver.result.vars['x'+k]})
            }
    
            console.log("Players points sum : " + sum + " , calculated sum : " + solver.result.z + ", percent : " + solver.result.z/sum)
            console.log(solver.result.vars)
            resultGLPK.push(solver.result.vars)
            rownumber++
        } else{
            break
        }
        

    }
    

 
    var selected = resultGLPK[randomNumber(resultGLPK.length -1, 0)]  
    var resultModule = JSON.parse(JSON.stringify(list))
    
    for(var i = 0; i<numOfPlayers ; i++){
        resultModule[i].team = selected["x"+i] + 1
    }

    resultModule = await resultModule.sort((a,b) => (a.team < b.team) ? 1: (a.team == b.team) ? ((a.total < b.total) ? 1 : -1) : -1)
    
    console.log(resultModule)
    return resultModule
    },

    glpk3 : async function(playerInfo){
        const list = playerInfo
        var resultGLPK = []
        var resultModule = {}
        const numOfPlayers = list.length
        var max = 0.345
        var min = 0.315
        var numOfMembers
        var sum = 0
        var sumatk = 0
        var sumdef = 0
    
        let mip = {
            name: 'MIP',
            objective: { direction: glpk.GLP_MAX, name: 'obj', vars: [] },
            subjectTo: [
                { name: 'row1', vars: [] },
                { name: 'row2', vars: [] },
                { name: 'row3', vars: [] },
                { name: 'row4', vars: [] }
            ],
            binaries: []
        }

        var rownumber = 5
        
        for(var i = 0 ; i < numOfPlayers ; i++){
    
            var player = list[i]
    
            mip.objective.vars.push({ name: 'x'+i, coef: player.total})
            mip.subjectTo[0].vars.push({ name: 'x'+i, coef: player.total})
            mip.subjectTo[1].vars.push({ name: 'x'+i, coef: 1})
            mip.subjectTo[2].vars.push({ name: 'x'+i, coef: player.def})
            mip.subjectTo[3].vars.push({ name: 'x'+i, coef: player.atk})
            
            mip.binaries.push('x'+i)
    
            sum += player.total
            sumatk += player.atk
            sumdef += player.def
        
        }
        
        mip.subjectTo[0].bnds = { type: glpk.GLP_DB, ub: sum * 0.33 , lb: sum * min }
        mip.subjectTo[2].bnds = { type: glpk.GLP_DB, ub: sumdef * max , lb: sumdef * min }
        mip.subjectTo[3].bnds = { type: glpk.GLP_DB, ub: sumatk * max , lb: sumatk * min }
        
        if(list.length%3 == 1){
            mip.subjectTo[1].bnds = { type: glpk.GLP_FX, ub: (list.length-1)/3, lb: (list.length-1)/3}
            numOfMembers = (list.length-1)/3
        }
        else if (list.length%3 == 2){
            mip.subjectTo[1].bnds = { type: glpk.GLP_FX, ub:  (list.length-2)/3, lb:  (list.length-2)/3}
            numOfMembers = (list.length-2)/3
        }
        else {
            mip.subjectTo[1].bnds = { type: glpk.GLP_FX, ub: list.length/3, lb: list.length/3}
            numOfMembers = list.length/3
        }
    
        while(resultGLPK.length < 3){
        
            var solver = await glpk.solve(mip, glpk.GPL_MSG_ALL)

            if(solver.result.status != 4){
               
                mip.subjectTo.push({name: 'row'+rownumber, vars:[], bnds:{type: glpk.GLP_UP, ub: numOfMembers-1 , lb: 0.0}})
                
                for(var k=0 ; k < numOfPlayers ; k++){
    
                    mip.subjectTo[rownumber-1].vars.push({ name: 'x'+k, coef: solver.result.vars['x'+k]})
                }
                resultGLPK.push(solver.result.vars)
               
                rownumber++
            } else{
                break
            }
            
        }
        
    
        
        var selected = resultGLPK[randomNumber(resultGLPK.length-1, 0)]
        var resultModule = JSON.parse(JSON.stringify(list))
        var restPlayers = JSON.parse(JSON.stringify(resultModule))
        
        var j = 0
        var k = 0
        for(var i = 0; i<numOfPlayers ; i++){
            if(selected["x"+i] == 1){
                resultModule[i-k].team = selected["x"+i] + 2   
                restPlayers.splice(i-j,1)
                j += 1
            } else {
                resultModule.splice(i-k, 1)
                k += 1
            }
        }
       
        restPlayers = await this.glpk2(restPlayers)
        
        resultModule = resultModule.concat(restPlayers)
      
        resultModule = await resultModule.sort((a,b) => (a.team < b.team) ? 1: (a.team == b.team) ? ((a.total < b.total) ? 1 : -1) : -1)
        
        
        return resultModule

        
        
        
}}

function randomNumber(max, min){
    return Math.floor((Math.random()* (max - min + 1)) + min)
}

function checkDuplicate(list, element){
  var sizeOfList = list.length

  for(var i = 0 ; i < sizeOfList ; i++){
      if (isEquivalent(list[i], element))
        return true
  }

  return false

}

function isEquivalent(a, b) {
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
      return false;
  }

  for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
          return false;
      }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}