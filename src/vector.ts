const nil = Symbol("nil");

export class Vector {
    transforms: Function[][] = [];
    arrays: any[][] = [];

    constructor(x: Iterable<any>) {
        if (Array.isArray(x)) this.arrays[0] = x;
        else this.arrays[0] = Array.from(x);
    }

    static of(...x) {
        return new Vector(x);
    }

    map(fn: (x: any) => any): Vector {
        for (let i = 0, len = this.arrays.length; i < len; i++) {
            if (!this.transforms[i]) {
                this.transforms[i] = [];
            }
            this.transforms[i].push(fn);
        }
        return this;
    }

    filter(pred: (x: any) => boolean): Vector {
        for (let i = 0, len = this.arrays.length; i < len; i++) {
            if (!this.transforms[i]) {
                this.transforms[i] = [];
            }
            this.transforms[i].push((x: any) => (pred(x) ? x : nil));
        }
        return this;
    }

    take(n: number): Vector {
        const result = [];
        for (let i = 0, len = this.arrays.length; i < len; i++) {
            for (let j = 0, jlen = this.arrays[i].length; j < jlen; j++) {
                let res: any = this.arrays[i][j];
                for (let k = 0, klen = this.transforms[i] ? this.transforms[i].length : 0; k < klen; k++) {
                    if (res !== nil) {
                        res = this.transforms[i][k](res);
                    } else {
                        break;
                    }
                }
                if (res !== nil) {
                    result.push(res);
                }
                if (result.length === n) return new Vector(result);
            }
        }
        return new Vector(result);
    }

    get(index: number): any {
        let noTransforms = true;
        for (let i = 0, len = this.transforms.length; i < len; i++) {
            if (this.transforms[i] && this.transforms[i].length > 0)
                noTransforms = false;
        }

        if (noTransforms) {
            let lengthSoFar = 0;
            let arrayIndex = 0;
            let arrayLength = this.arrays.length;
            while (
                lengthSoFar + this.arrays[arrayIndex].length < index &&
                arrayIndex < arrayLength
                ) {
                lengthSoFar += this.arrays[arrayIndex].length;
                arrayIndex++;
            }
            return this.arrays[arrayIndex][index - lengthSoFar];
        } else {
            const vec = this.take(index + 1);
            return vec.arrays[0][index];
        }
    }

    concat(xs: any[]) {
        this.arrays.push(xs);
        return this;
    }

    append(x: any) {
        this.arrays.push([x]);
        return this;
    }

    prepend(x: any) {
        this.arrays.unshift([x]);
        this.transforms.unshift([]);
        return this;
    }

    toArray() {
        const result = [];
        for (let i = 0, len = this.arrays.length; i < len; i++) {
            for (let j = 0, jlen = this.arrays[i].length; j < jlen; j++) {
                let res = this.arrays[i][j];
                for (let k = 0, klen = this.transforms[i] ? this.transforms[i].length : 0; k < klen; k++) {
                    res = this.transforms[i][k](res);
                }
                if (res !== nil) {
                    result.push(res);
                }
            }
        }
        return result;
    }
}

