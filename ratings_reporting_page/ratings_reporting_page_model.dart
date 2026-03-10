import '/appp/compoments/side_nav/side_nav_widget.dart';
import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'dart:async';
import 'ratings_reporting_page_widget.dart' show RatingsReportingPageWidget;
import 'package:flutter/material.dart';

class RatingsReportingPageModel
    extends FlutterFlowModel<RatingsReportingPageWidget> {
  ///  State fields for stateful widgets in this page.

  Completer<List<RatingsInputsTemporaryRow>>? requestCompleter;
  // Model for sideNav component.
  late SideNavModel sideNavModel;

  @override
  void initState(BuildContext context) {
    sideNavModel = createModel(context, () => SideNavModel());
  }

  @override
  void dispose() {
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

  Future waitForRequestCompleted({
    double minWait = 0,
    double maxWait = double.infinity,
  }) async =>
      _waitForCompleter(
        requestCompleter,
        minWait: minWait,
        maxWait: maxWait,
      );
}
