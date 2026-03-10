import '/appp/compoments/side_nav/side_nav_widget.dart';
import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'dart:async';
import 'ratings_edit_widget.dart' show RatingsEditWidget;
import 'package:flutter/material.dart';

class RatingsEditModel extends FlutterFlowModel<RatingsEditWidget> {
  ///  State fields for stateful widgets in this page.

  Completer<List<RatingsInputsRow>>? requestCompleter6;
  Completer<List<RatingsInputsRow>>? requestCompleter5;
  Completer<List<HorsesRow>>? requestCompleter3;
  Completer<List<HorsesRow>>? requestCompleter4;
  Completer<List<RatingsInputsRow>>? requestCompleter2;
  Completer<List<RatingsInputsRow>>? requestCompleter1;
  // State field(s) for RatingMOB widget.
  String? ratingMOBValue;
  FormFieldController<String>? ratingMOBValueController;
  // State field(s) for StallionMobile widget.
  String? stallionMobileValue;
  FormFieldController<String>? stallionMobileValueController;
  // State field(s) for NoteMobile widget.
  FocusNode? noteMobileFocusNode;
  TextEditingController? noteMobileTextController;
  String? Function(BuildContext, String?)? noteMobileTextControllerValidator;
  // State field(s) for AuthorMOB widget.
  String? authorMOBValue;
  FormFieldController<String>? authorMOBValueController;
  // Stores action output result for [Backend Call - Update Row(s)] action in Button widget.
  List<RatingsInputsRow>? ratingInputMobile;
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
  // State field(s) for AuthorTab widget.
  String? authorTabValue;
  FormFieldController<String>? authorTabValueController;
  // Stores action output result for [Backend Call - Update Row(s)] action in Button widget.
  List<RatingsInputsRow>? ratingInputTablte;
  // Model for sideNav component.
  late SideNavModel sideNavModel;

  @override
  void initState(BuildContext context) {
    sideNavModel = createModel(context, () => SideNavModel());
  }

  @override
  void dispose() {
    noteMobileFocusNode?.dispose();
    noteMobileTextController?.dispose();

    noteTabletFocusNode?.dispose();
    noteTabletTextController?.dispose();

    sideNavModel.dispose();
  }

  /// Additional helper methods.
  Future waitForRequestCompleted6({
    double minWait = 0,
    double maxWait = double.infinity,
  }) async {
    final stopwatch = Stopwatch()..start();
    while (true) {
      await Future.delayed(Duration(milliseconds: 50));
      final timeElapsed = stopwatch.elapsedMilliseconds;
      final requestComplete = requestCompleter6?.isCompleted ?? false;
      if (timeElapsed > maxWait || (requestComplete && timeElapsed > minWait)) {
        break;
      }
    }
  }

  Future waitForRequestCompleted5({
    double minWait = 0,
    double maxWait = double.infinity,
  }) async {
    final stopwatch = Stopwatch()..start();
    while (true) {
      await Future.delayed(Duration(milliseconds: 50));
      final timeElapsed = stopwatch.elapsedMilliseconds;
      final requestComplete = requestCompleter5?.isCompleted ?? false;
      if (timeElapsed > maxWait || (requestComplete && timeElapsed > minWait)) {
        break;
      }
    }
  }

  Future waitForRequestCompleted3({
    double minWait = 0,
    double maxWait = double.infinity,
  }) async {
    final stopwatch = Stopwatch()..start();
    while (true) {
      await Future.delayed(Duration(milliseconds: 50));
      final timeElapsed = stopwatch.elapsedMilliseconds;
      final requestComplete = requestCompleter3?.isCompleted ?? false;
      if (timeElapsed > maxWait || (requestComplete && timeElapsed > minWait)) {
        break;
      }
    }
  }

  Future waitForRequestCompleted4({
    double minWait = 0,
    double maxWait = double.infinity,
  }) async {
    final stopwatch = Stopwatch()..start();
    while (true) {
      await Future.delayed(Duration(milliseconds: 50));
      final timeElapsed = stopwatch.elapsedMilliseconds;
      final requestComplete = requestCompleter4?.isCompleted ?? false;
      if (timeElapsed > maxWait || (requestComplete && timeElapsed > minWait)) {
        break;
      }
    }
  }

  Future waitForRequestCompleted2({
    double minWait = 0,
    double maxWait = double.infinity,
  }) async {
    final stopwatch = Stopwatch()..start();
    while (true) {
      await Future.delayed(Duration(milliseconds: 50));
      final timeElapsed = stopwatch.elapsedMilliseconds;
      final requestComplete = requestCompleter2?.isCompleted ?? false;
      if (timeElapsed > maxWait || (requestComplete && timeElapsed > minWait)) {
        break;
      }
    }
  }

  Future waitForRequestCompleted1({
    double minWait = 0,
    double maxWait = double.infinity,
  }) async {
    final stopwatch = Stopwatch()..start();
    while (true) {
      await Future.delayed(Duration(milliseconds: 50));
      final timeElapsed = stopwatch.elapsedMilliseconds;
      final requestComplete = requestCompleter1?.isCompleted ?? false;
      if (timeElapsed > maxWait || (requestComplete && timeElapsed > minWait)) {
        break;
      }
    }
  }
}
