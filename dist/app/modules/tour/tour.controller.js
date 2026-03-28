"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const tour_service_1 = require("./tour.service");
const createTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // throw new Error("A tour of this title already exists");
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map(file => file.path) });
    const result = yield tour_service_1.TourService.createTour(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Tour created successfully',
        data: result,
    });
}));
const getAllTours = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield tour_service_1.TourService.getAllTours(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tours retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const result = yield tour_service_1.TourService.getSingleTour(slug);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Tour retrieved",
        data: result.data,
    });
}));
const updateTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const payload = Object.assign(Object.assign({}, req.body), { images: req.files.map(file => file.path) });
    const result = yield tour_service_1.TourService.updateTour(id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tour updated successfully',
        data: result,
    });
}));
const deleteTour = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = yield tour_service_1.TourService.deleteTour(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tour deleted successfully',
        data: result,
    });
}));
const getAllTourTypes = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield tour_service_1.TourService.getAllTourTypes();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tour types retrieved successfully',
        data: result,
    });
}));
const getSingleTourType = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = Array.isArray(req.params.name) ? req.params.name[0] : req.params.name;
    const result = yield tour_service_1.TourService.getSingleTourType(name);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "TourType retrieved",
        data: result.data,
    });
}));
const createTourType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("createTourType", req.body);
    const data = req.body;
    const result = yield tour_service_1.TourService.createTourType(data);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });
});
const updateTourType = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name } = req.body;
    const result = yield tour_service_1.TourService.updateTourType(id, name);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type updated successfully',
        data: result,
    });
}));
const deleteTourType = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = yield tour_service_1.TourService.deleteTourType(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type deleted successfully',
        data: result,
    });
}));
exports.TourController = {
    createTour,
    updateTour,
    getAllTours,
    getSingleTour,
    deleteTour,
    createTourType,
    updateTourType,
    getAllTourTypes,
    getSingleTourType,
    deleteTourType,
};
