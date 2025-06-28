import { AStarNode } from "./astar.js";

export class MinBinaryHeap {
    constructor() {
        /**@type {AStarNode[]} */
        this.heap = [];
    }

    /**@private */
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    /**@private */
    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    /**@private */
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    pop() {
        if (this.heap.length == 0) {
            return null;
        }

        if (this.heap.length == 1) {
            return this.heap.pop();
        }

        const rootValue = this.heap[0];
        this.heap[0] = this.heap.pop();

        this.bubbleDown(0);
        return rootValue;
    }

    push(element) {
        this.heap.push(element);
        let elementIndex = this.heap.length - 1;
        this.bubbleUp(elementIndex);
    }

    /**@private */
    bubbleUp(index) {

        let parentIndex = this.getParentIndex(index);

        while (parentIndex != -1) {
            if (this.heap[index].fCost < this.heap[parentIndex].fCost) {
                const temp = this.heap[parentIndex];
                this.heap[parentIndex] = this.heap[index];
                this.heap[index] = temp;

                index = parentIndex;
                parentIndex = this.getParentIndex(index);
            } else {
                break;
            }

        }
    }

    /**@private */
    bubbleDown(index) {
        while (true) {
            let smallestIndex = index;
            let leftChildIndex = this.getLeftChildIndex(index);
            let rightChildIndex = this.getRightChildIndex(index);

            if (leftChildIndex < this.heap.length && this.heap[leftChildIndex].fCost < this.heap[smallestIndex].fCost) {
                smallestIndex = leftChildIndex;
            }

            if (rightChildIndex < this.heap.length && this.heap[rightChildIndex].fCost < this.heap[smallestIndex].fCost) {
                smallestIndex = rightChildIndex;
            }

            if (smallestIndex == index) {
                break;
            } else {
                const temp = this.heap[index];
                this.heap[index] = this.heap[smallestIndex];
                this.heap[smallestIndex] = temp;

                index = smallestIndex;
            }
        }
    }

}