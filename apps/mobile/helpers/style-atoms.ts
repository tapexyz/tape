export const styleAtoms = {
  debug: {
    borderColor: "red",
    borderWidth: 1
  },
  /* Position */
  absolute: {
    position: "absolute"
  },
  relative: {
    position: "relative"
  },
  overflowHidden: {
    overflow: "hidden"
  },
  wFull: {
    width: "100%"
  },
  hFull: {
    height: "100%"
  },
  /* Flex */
  flex1: {
    flex: 1
  },
  flexRow: {
    flexDirection: "row"
  },
  flexColumn: {
    flexDirection: "column"
  },
  justifyCenter: {
    justifyContent: "center"
  },
  alignCenter: {
    alignItems: "center"
  },
  /* Text */
  textCenter: {
    textAlign: "center"
  },
  textXs: {
    fontSize: 12
  },
  textSm: {
    fontSize: 14
  },
  textMd: {
    fontSize: 16
  },
  textLg: {
    fontSize: 18
  },
  textXl: {
    fontSize: 20
  }
} as const;
