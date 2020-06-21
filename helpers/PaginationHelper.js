"use strict";

class Pagination{
    constructor(totalCount,currentPage,perPage=12){
        this.perPage = perPage;
        this.totalCount =parseInt(totalCount);
        this.currentPage = parseInt(currentPage);
        this.previousPage = this.currentPage - 1;
        this.pageCount = Math.ceil(this.totalCount / this.perPage);
        this.offset  = this.currentPage > 1 && this.pageCount > this.currentPage ? this.previousPage * this.perPage : 0;
    }
}

module.exports = Pagination