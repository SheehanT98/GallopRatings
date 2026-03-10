import '/appp/compoments/side_nav/side_nav_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'ratings_home_widget.dart' show RatingsHomeWidget;
import 'package:flutter/material.dart';

class RatingsHomeModel extends FlutterFlowModel<RatingsHomeWidget> {
  ///  State fields for stateful widgets in this page.

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
}
