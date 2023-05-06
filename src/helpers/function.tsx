import { IFunctionHelper } from '../utils/types'

const reposition = (data: Array<any>, from: number, to: number): Array<any> => {

    let temp: Array<any> = []
    let result: Array<any> = [];

    temp = [...data];

    // remove item from the {from} index and save
    const item = data.splice(from, 1)[0];

    if(item){

        result = [...data]; // spread out the remaining items
        result.splice(to, 0, item) // add the item back

    }else{
        result = [...temp]
    }

    return result;

}

const helperService: IFunctionHelper = {
    reposition: reposition,
}

export default helperService;