exports.parseUncPath = function (uncPath) {
  if (uncPath.substr(0, 2) !== "\\\\") {
    throw "Not a valid unc path";
  }
  
  var pathParts = uncPath.split("\\");
  mountPattern = "/mnt/[share_name]";
  var mountPath = mountPattern.replace("[server_name]", pathParts[2]).replace("[share_name]", pathParts[3]);
  var newPathParts = pathParts.slice(4);
  var mountTargetPath = mountPath + "/" + newPathParts.join("/");

  var mountPointUnc = '//' + pathParts[2] + '/' + pathParts[3];

  return { 'mountTargetPath': mountTargetPath.trimRight(), 'mountPoint': mountPath, 'mountPointUnc': mountPointUnc };
};

exports.mountVolume = function (uncObject, user, password, callback) {
  // create mountpoint and mount requested volume
  var mkdir = exec('mkdir -p ' + uncObject.mountPoint, function (error, stdout, stderr) {
    var checkExisting = false, mountCmd;
    if (process.platform === 'linux') {
      // issue mount command using cifs after checking for already mmounted volumess
      mountCmd = 'mount -t cifs ' + uncObject.mountPointUnc + ' ' + uncObject.mountPoint + ' -o username=' + user + ',password=' + password;
      checkExisting = true;
    } else {
      // assume mac platform, mount using afp
      mountCmd = 'mount_afp afp://' + user + ':' + password + '@' + uncObject.mountPointUnc.substr(2) + ' ' + uncObject.mountPoint;
    }
    
    if (checkExisting) {
      exec('cat /proc/mounts | grep ' + uncObject.mountPointUnc, function (error, stdout, stderr) {
        if (stdout === '') {
          exec(mountCmd, function (error, stdout, stderr) {
            callback(error, stdout, stderr, uncObject);
          });
        } else {
          // just execute callback without mounting
          callback(null, null, null, uncObject);
        }
      });
    } else {
      exec(mountCmd, function (error, stdout, stderr) {
        callback(error, stdout, stderr, uncObject);
      });
    }
  });
};