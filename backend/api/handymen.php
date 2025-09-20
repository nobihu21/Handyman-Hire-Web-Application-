<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';
$data = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getHandymanDetails($conn, $_GET['id']);
        } elseif (isset($_GET['service_type'])) {
            getHandymenByService($conn, $_GET['service_type']);
        } else {
            getAllHandymen($conn);
        }
        break;

    case 'POST':
        switch ($action) {
            case 'update_location':
                updateHandymanLocation($conn, $data);
                break;
            case 'update_availability':
                updateHandymanAvailability($conn, $data);
                break;
            case 'verify':
                verifyHandyman($conn, $data);
                break;
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action']);
                break;
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getAllHandymen($conn) {
    $stmt = $conn->prepare("
        SELECT 
            h.*,
            u.name,
            u.email,
            u.phone,
            u.status as user_status
        FROM handymen h
        JOIN users u ON h.user_id = u.id
        WHERE h.status = 'verified'
        ORDER BY h.rating DESC
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $handymen = [];
    while ($row = $result->fetch_assoc()) {
        $handymen[] = $row;
    }
    $stmt->close();

    echo json_encode(['handymen' => $handymen]);
}

function getHandymanDetails($conn, $id) {
    $stmt = $conn->prepare("
        SELECT 
            h.*,
            u.name,
            u.email,
            u.phone,
            u.status as user_status,
            (
                SELECT COUNT(*)
                FROM bookings b
                WHERE b.handyman_id = h.id AND b.status = 'completed'
            ) as completed_jobs,
            (
                SELECT AVG(rating)
                FROM reviews r
                WHERE r.handyman_id = h.id
            ) as average_rating
        FROM handymen h
        JOIN users u ON h.user_id = u.id
        WHERE h.id = ?
    ");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Handyman not found']);
        return;
    }

    $handyman = $result->fetch_assoc();
    $stmt->close();

    // Get reviews
    $stmt = $conn->prepare("
        SELECT 
            r.*,
            u.name as user_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.handyman_id = ?
        ORDER BY r.created_at DESC
        LIMIT 5
    ");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }
    $stmt->close();

    $handyman['reviews'] = $reviews;
    echo json_encode(['handyman' => $handyman]);
}

function getHandymenByService($conn, $serviceType) {
    // Validate service type
    if (!in_array($serviceType, ['electrician', 'plumber'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid service type']);
        return;
    }

    $stmt = $conn->prepare("
        SELECT 
            h.*,
            u.name,
            u.phone,
            (
                SELECT COUNT(*)
                FROM bookings b
                WHERE b.handyman_id = h.id AND b.status = 'completed'
            ) as completed_jobs
        FROM handymen h
        JOIN users u ON h.user_id = u.id
        WHERE h.service_type = ?
        AND h.status = 'verified'
        AND h.is_available = 1
        AND u.status = 'active'
        ORDER BY h.rating DESC
    ");
    $stmt->bind_param("s", $serviceType);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $handymen = [];
    while ($row = $result->fetch_assoc()) {
        $handymen[] = $row;
    }
    $stmt->close();

    echo json_encode(['handymen' => $handymen]);
}

function updateHandymanLocation($conn, $data) {
    // Validate required fields
    if (!isset($data['handyman_id']) || !isset($data['lat']) || !isset($data['lng'])) {
        http_response_code(400);
        echo json_encode(['error' => 'handyman_id, lat, and lng are required']);
        return;
    }

    try {
        $stmt = $conn->prepare("
            UPDATE handymen
            SET current_location_lat = ?, current_location_lng = ?
            WHERE id = ?
        ");
        $stmt->bind_param("ddi", $data['lat'], $data['lng'], $data['handyman_id']);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['message' => 'Location updated successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Handyman not found']);
        }
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Location update failed']);
    }
}

function updateHandymanAvailability($conn, $data) {
    // Validate required fields
    if (!isset($data['handyman_id']) || !isset($data['is_available'])) {
        http_response_code(400);
        echo json_encode(['error' => 'handyman_id and is_available are required']);
        return;
    }

    try {
        $stmt = $conn->prepare("
            UPDATE handymen
            SET is_available = ?
            WHERE id = ?
        ");
        $stmt->bind_param("ii", $data['is_available'], $data['handyman_id']);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['message' => 'Availability updated successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Handyman not found']);
        }
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Availability update failed']);
    }
}

function verifyHandyman($conn, $data) {
    // Validate required fields
    if (!isset($data['handyman_id']) || !isset($data['status'])) {
        http_response_code(400);
        echo json_encode(['error' => 'handyman_id and status are required']);
        return;
    }

    // Validate status
    if (!in_array($data['status'], ['verified', 'rejected'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid status']);
        return;
    }

    try {
        $stmt = $conn->prepare("
            UPDATE handymen
            SET status = ?
            WHERE id = ?
        ");
        $stmt->bind_param("si", $data['status'], $data['handyman_id']);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['message' => 'Handyman verification status updated successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Handyman not found']);
        }
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Verification update failed']);
    }
}
?> 