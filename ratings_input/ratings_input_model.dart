import '/appp/compoments/dropdown01_options/dropdown01_options_widget.dart';
import '/appp/compoments/side_nav/side_nav_widget.dart';
import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'dart:async';
import 'ratings_input_widget.dart' show RatingsInputWidget;
import 'package:flutter/material.dart';

class RatingsInputModel extends FlutterFlowModel<RatingsInputWidget> {
  ///  State fields for stateful widgets in this page.

  Completer<List<HorsesRow>>? requestCompleter1;
  Completer<List<HorsesRow>>? requestCompleter3;
  // State field(s) for MareMbile widget.
  String? mareMbileValue;
  FormFieldController<String>? mareMbileValueController;
  Completer<List<HorsesRow>>? requestCompleter4;
  Completer<List<RatingsInputsRow>>? requestCompleter5;
  // State field(s) for DropDown widget.
  String? dropDownValue;
  FormFieldController<String>? dropDownValueController;
  // State field(s) for StallionMobile widget.
  String? stallionMobileValue;
  FormFieldController<String>? stallionMobileValueController;
  // State field(s) for NoteMobile widget.
  FocusNode? noteMobileFocusNode;
  TextEditingController? noteMobileTextController;
  String? Function(BuildContext, String?)? noteMobileTextControllerValidator;
  // State field(s) for AuthorDesktop widget.
  String? authorDesktopValue1;
  FormFieldController<String>? authorDesktopValueController1;
  // Stores action output result for [Backend Call - Insert Row] action in Button widget.
  RatingsInputsRow? ratingInputMobile;
  // State field(s) for DropDownTablet widget.
  String? dropDownTabletValue;
  FormFieldController<String>? dropDownTabletValueController;
  Completer<List<RatingsInputsRow>>? requestCompleter2;
  // State field(s) for RatingTab widget.
  String? ratingTabValue;
  FormFieldController<String>? ratingTabValueController;
  // State field(s) for StallionTbalet widget.
  String? stallionTbaletValue;
  FormFieldController<String>? stallionTbaletValueController;
  // State field(s) for NoteTablet widget.
  FocusNode? noteTabletFocusNode;
  TextEditingController? noteTabletTextController;
  String? Function(BuildContext, String?)? noteTabletTextControllerValidator;
  // State field(s) for AuthorDesktop widget.
  String? authorDesktopValue2;
  FormFieldController<String>? authorDesktopValueController2;
  // Stores action output result for [Backend Call - Insert Row] action in Button widget.
  RatingsInputsRow? ratingInputTablte;
  // Model for Dropdown01Options component.
  late Dropdown01OptionsModel dropdown01OptionsModel;
  // Model for sideNav component.
  late SideNavModel sideNavModel;

  @override
  void initState(BuildContext context) {
    dropdown01OptionsModel =
        createModel(context, () => Dropdown01OptionsModel());
    sideNavModel = createModel(context, () => SideNavModel());
  }

  @override
  void dispose() {
    noteMobileFocusNode?.dispose();
    noteMobileTextController?.dispose();

    noteTabletFocusNode?.dispose();
    noteTabletTextController?.dispose();

    dropdown01OptionsModel.dispose();
    sideNavModel.dispose();
  }

  /// Additional helper methods.
  Future _waitForCompleter(
    Completer<dynamic>? completer, {
    double minWait = 0,
    double maxWait = double.infinity,
  }) async {
    final stopwatch = Stopwatch()..start();
    while (true) {
      await Future.delayed(Duration(milliseconds: 50));
      final timeElapsed = stopwatch.elapsedMilliseconds;
      final requestComplete = completer?.isCompleted ?? false;
      if (timeElapsed > maxWait || (requestComplete && timeElapsed > minWait)) {
        break;
      }
    }
  }

  Future waitForRequestCompleted1({
    double minWait = 0,
    double maxWait = double.infinity,
  }) async =>
      _waitForCompleter(
        requestCompleter1,
        minWait: minWait,
        maxWait: maxWait,
      );

  Future waitForRequestCompleted3({
    double minWait = 0,
    double maxWait = double.infinity,
  }) async =>
      _waitForCompleter(
        requestCompleter3,
        minWait: minWait,
        maxWait: maxWait,
      );

  Future waitForRequestCompleted4({
    double minWait = 0,
    double maxWait = double.infinity,
  }) async =>
      _waitForCompleter(
        requestCompleter4,
        minWait: minWait,
        maxWait: maxWait,
      );

  Future waitForRequestCompleted5({
    double minWait = 0,
    double maxWait = double.infinity,
  }) async =>
      _waitForCompleter(
        requestCompleter5,
        minWait: minWait,
        maxWait: maxWait,
      );

  Future waitForRequestCompleted2({
    double minWait = 0,
    double maxWait = double.infinity,
  }) async =>
      _waitForCompleter(
        requestCompleter2,
        minWait: minWait,
        maxWait: maxWait,
      );
}
